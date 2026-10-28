import { KLAVIYO } from '../config.js';

// Non-PHI only: email and an optional first name. Quiz answers never come
// through here. Destination is the Klaviyo account already connected to the
// Shopify store (public company id KLAVIYO.companyId). There is no published
// list id on the storefront, so this writes a profile and a
// "Quiz Results Requested" event in that account. Klaviyo's Shopify app is
// what syncs the account with the shop.

const headers = {
  'Content-Type': 'application/json',
  revision: KLAVIYO.revision,
  Accept: 'application/json'
};

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

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

export async function saveQuizLead({ email, firstName }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(firstName || '').trim();
  if (!isValidEmail(cleanEmail)) {
    throw new Error('invalid email');
  }

  const attributes = profileAttributes(cleanEmail, cleanName);
  const profile = { data: { type: 'profile', attributes: { email: cleanEmail } } };
  if (cleanName) profile.data.attributes.first_name = cleanName;

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
