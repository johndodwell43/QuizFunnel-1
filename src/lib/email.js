// Client-side checks for the results gate. The server (Klaviyo) checks again.

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function isValidEmail(value) {
  const email = String(value || '').trim();
  if (!email || email.length > 254) return false;
  return EMAIL_RE.test(email);
}

// Empty is allowed. A name that is too long or not a name is rejected
// so this field cannot carry a medical note.
export function normalizeFirstName(value) {
  const name = String(value || '').trim().replace(/\s+/g, ' ');
  if (!name) return '';
  if (name.length > 40) return null;
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) return null;
  if (name.split(' ').length > 2) return null;
  return name;
}
