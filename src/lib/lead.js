// Browser side of the results gate. Sends email and an optional first name
// to the same-origin /api/lead route. That route writes the non-PHI lead to
// the Klaviyo account already connected to the Shopify store. Quiz answers
// are not included.

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export async function saveQuizLead({ email, firstName }) {
  const cleanEmail = String(email || '').trim();
  const cleanName = String(firstName || '').trim();
  if (!isValidEmail(cleanEmail)) {
    throw new Error('invalid email');
  }

  const response = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: cleanEmail,
      ...(cleanName ? { firstName: cleanName } : {})
    })
  });
  if (!response.ok) {
    throw new Error('lead save failed');
  }
}
