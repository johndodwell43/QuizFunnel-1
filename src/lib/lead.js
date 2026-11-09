import { isValidEmail, normalizeFirstName, normalizePhone } from './email.js';

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

// Same-origin save. api/quiz-lead.js forwards email, optional first name,
// and optional phone. Quiz answers stay in the browser.
export async function persistQuizLead({ email, firstName, phone }) {
  const trimmedEmail = String(email || '').trim();
  const name = normalizeFirstName(firstName);
  const normalizedPhone = normalizePhone(phone);
  if (!isValidEmail(trimmedEmail) || name === null || normalizedPhone === null) {
    throw new Error('invalid-lead');
  }

  const response = await fetch('/api/quiz-lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: trimmedEmail,
      firstName: name,
      phone: normalizedPhone,
      utm_source: readUtm('utm_source'),
      utm_campaign: readUtm('utm_campaign'),
      utm_content: readUtm('utm_content')
    })
  });

  if (!response.ok) throw new Error('lead-save-failed');
  return { email: trimmedEmail, firstName: name, phone: normalizedPhone };
}
