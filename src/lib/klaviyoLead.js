import { KLAVIYO } from '../config.js';

// Server-only writer. The browser posts to /api/lead so the quiz origin, not
// the visitor's browser, talks to Klaviyo. Quiz answers are never accepted.

const headers = {
  'Content-Type': 'application/json',
  revision: KLAVIYO.revision
};

function profileAttributes(email, firstName) {
  const attributes = {
    email,
    properties: { source: KLAVIYO.source }
  };
  if (firstName) attributes.first_name = firstName;
  return attributes;
}

async function postJson(path, body) {
  const response = await fetch(
    `https://a.klaviyo.com/client/${path}/?company_id=${encodeURIComponent(KLAVIYO.companyId)}`,
    { method: 'POST', headers, body: JSON.stringify(body) }
  );
  if (!response.ok) {
    throw new Error('lead save failed');
  }
}

export function normalizeLead(input) {
  const email = String(input?.email || '').trim().toLowerCase();
  const firstName = String(input?.firstName || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error('invalid email');
    error.status = 400;
    throw error;
  }
  return { email, firstName };
}

export async function writeKlaviyoLead(input) {
  const { email, firstName } = normalizeLead(input);
  const attributes = profileAttributes(email, firstName);
  const profile = { data: { type: 'profile', attributes: { email } } };
  if (firstName) profile.data.attributes.first_name = firstName;

  await postJson('profiles', { data: { type: 'profile', attributes } });
  await postJson('events', {
    data: {
      type: 'event',
      attributes: {
        properties: { source: KLAVIYO.source },
        metric: {
          data: { type: 'metric', attributes: { name: KLAVIYO.metric } }
        },
        profile
      }
    }
  });
}
