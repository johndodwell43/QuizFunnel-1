import { isValidEmail, normalizeFirstName } from './email.js';

// Klaviyo public site ID on the Klyros Shopify store
// (shop metafield klaviyo.company_id, and the onsite embed on
// tfvziu-ia.myshopify.com). This repo has no waitlist route and Klaviyo
// has no published signup form, so there is no list ID to target.
// Profiles and the "Quiz Results Requested" metric land in that account.
// Set VITE_KLAVIYO_LIST_ID to also subscribe the profile to a list.
export const KLAVIYO_COMPANY_ID = 'XaqymG';
export const KLAVIYO_METRIC = 'Quiz Results Requested';

const KLAVIYO_REVISION = '2026-10-15';
const KLAVIYO_ORIGIN = 'https://a.klaviyo.com';

const ANSWER_KEYS = {
  arch: ['upper', 'lower', 'both'],
  teeth: ['1', '2-3', '4-6', 'most'],
  extraction: ['no', 'yes'],
  pain: ['no', 'yes'],
  loose: ['no', 'yes']
};

function allowedAnswer(key, value) {
  return ANSWER_KEYS[key].includes(value) ? value : '';
}

function readUtm(name) {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get(name) || '';
    const stored = sessionStorage.getItem(name) || '';
    const value = (fromUrl || stored).trim();
    if (!value || value.length > 80) return '';
    if (!/^[a-zA-Z0-9._~:-]+$/.test(value)) return '';
    return value;
  } catch {
    return '';
  }
}

// Non-PHI only: coded quiz answers and campaign tags. No photos, no notes.
export function quizLeadProperties(answers) {
  const properties = {
    quiz_source: 'quiz.klyrosdental.com',
    quiz_arch: allowedAnswer('arch', answers?.arch),
    quiz_teeth: allowedAnswer('teeth', answers?.teeth),
    quiz_extraction: allowedAnswer('extraction', answers?.extraction),
    quiz_pain: allowedAnswer('pain', answers?.pain),
    quiz_loose: allowedAnswer('loose', answers?.loose)
  };
  const source = readUtm('utm_source');
  const campaign = readUtm('utm_campaign');
  const content = readUtm('utm_content');
  if (source) properties.quiz_utm_source = source;
  if (campaign) properties.quiz_utm_campaign = campaign;
  if (content) properties.quiz_utm_content = content;
  return properties;
}

function profileAttributes(email, firstName, properties) {
  const attributes = { email, properties };
  if (firstName) attributes.first_name = firstName;
  return attributes;
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
  if (!response.ok) {
    throw new Error('lead-save-failed');
  }
}

export async function persistQuizLead({ email, firstName, answers }) {
  const trimmedEmail = String(email || '').trim();
  const name = normalizeFirstName(firstName);
  if (!isValidEmail(trimmedEmail) || name === null) {
    throw new Error('invalid-lead');
  }

  const properties = quizLeadProperties(answers);
  const attributes = profileAttributes(trimmedEmail, name, properties);

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
            attributes: name
              ? { email: trimmedEmail, first_name: name }
              : { email: trimmedEmail }
          }
        }
      }
    }
  });

  const listId = String(import.meta.env.VITE_KLAVIYO_LIST_ID || '').trim();
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

  return { email: trimmedEmail, firstName: name };
}
