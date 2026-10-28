import { isValidEmail, normalizeFirstName } from '../src/lib/email.js';

// Klaviyo public site ID on the Klyros Shopify store
// (shop metafield klaviyo.company_id, onsite embed on tfvziu-ia.myshopify.com).
// The browser cannot call Klaviyo directly: the preflight sends
// Access-Control-Allow-Credentials: true with Access-Control-Allow-Origin: *,
// which browsers reject. This module posts from the server instead.
const KLAVIYO_COMPANY_ID = 'XaqymG';
const KLAVIYO_METRIC = 'Quiz Results Requested';
const KLAVIYO_REVISION = '2026-10-15';
const KLAVIYO_ORIGIN = 'https://a.klaviyo.com';

const ANSWER_KEYS = {
  arch: ['upper', 'lower', 'both'],
  teeth: ['1', '2-3', '4-6', 'most'],
  extraction: ['no', 'yes'],
  pain: ['no', 'yes'],
  loose: ['no', 'yes']
};

function fail(statusCode) {
  const error = new Error('lead-save-failed');
  error.statusCode = statusCode;
  return error;
}

function allowedAnswer(key, value) {
  return ANSWER_KEYS[key].includes(value) ? value : '';
}

function safeTag(value) {
  const tag = String(value || '').trim();
  if (!tag || tag.length > 80) return '';
  if (!/^[a-zA-Z0-9._~:-]+$/.test(tag)) return '';
  return tag;
}

function quizProperties(answers, utm) {
  const properties = {
    quiz_source: 'quiz.klyrosdental.com',
    quiz_arch: allowedAnswer('arch', answers?.arch),
    quiz_teeth: allowedAnswer('teeth', answers?.teeth),
    quiz_extraction: allowedAnswer('extraction', answers?.extraction),
    quiz_pain: allowedAnswer('pain', answers?.pain),
    quiz_loose: allowedAnswer('loose', answers?.loose)
  };
  const source = safeTag(utm?.utm_source);
  const campaign = safeTag(utm?.utm_campaign);
  const content = safeTag(utm?.utm_content);
  if (source) properties.quiz_utm_source = source;
  if (campaign) properties.quiz_utm_campaign = campaign;
  if (content) properties.quiz_utm_content = content;
  return properties;
}

async function postKlaviyo(path, body) {
  const response = await fetch(
    `${KLAVIYO_ORIGIN}${path}?company_id=${encodeURIComponent(KLAVIYO_COMPANY_ID)}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
        revision: KLAVIYO_REVISION
      },
      body: JSON.stringify(body)
    }
  );
  if (!response.ok) throw fail(502);
}

export async function saveQuizLead(input) {
  const email = String(input?.email || '').trim();
  const firstName = normalizeFirstName(input?.firstName);
  if (!isValidEmail(email) || firstName === null) throw fail(400);

  const properties = quizProperties(input?.answers, input);
  const attributes = { email, properties };
  if (firstName) attributes.first_name = firstName;

  await postKlaviyo('/client/profiles/', {
    data: { type: 'profile', attributes }
  });

  await postKlaviyo('/client/events/', {
    data: {
      type: 'event',
      attributes: {
        properties,
        unique_id: crypto.randomUUID(),
        metric: {
          data: { type: 'metric', attributes: { name: KLAVIYO_METRIC } }
        },
        profile: {
          data: {
            type: 'profile',
            attributes: firstName ? { email, first_name: firstName } : { email }
          }
        }
      }
    }
  });

  const listId = String(process.env.KLAVIYO_LIST_ID || '').trim();
  if (/^[A-Za-z0-9]{4,12}$/.test(listId)) {
    await postKlaviyo('/client/subscriptions/', {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'quiz.klyrosdental.com results gate',
          profile: {
            data: {
              type: 'profile',
              attributes: {
                ...attributes,
                subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }
              }
            }
          }
        },
        relationships: { list: { data: { type: 'list', id: listId } } }
      }
    });
  }

  return { email, firstName };
}
