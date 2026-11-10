// Client-side checks for the results gate. The server (Klaviyo) checks again.

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function isValidEmail(value) {
  const email = String(value || '').trim();
  if (!email || email.length > 254) return false;
  return EMAIL_RE.test(email);
}

// The gate does not validate this field. Leading and trailing spaces are removed.
export function normalizeFirstName(value) {
  return String(value || '').trim();
}

// Blank is allowed. A non-empty value must be a US number so a text has a real destination.
export function normalizePhone(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(national)) return null;
  return `+1${national}`;
}

// An invalid number is omitted. It does not reject the rest of the lead.
export function phoneForLead(value) {
  const phone = normalizePhone(value);
  return phone === null ? '' : phone;
}

export function resolveEmailMarketingConsent(checked) {
  return checked === true;
}

// SMS consent is true only when that box is checked and a phone was entered.
export function resolveSmsConsent(checked, phone) {
  return checked === true && typeof phone === 'string' && phone.length > 0;
}
