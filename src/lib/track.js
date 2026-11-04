import posthog from 'posthog-js';

// PostHog is initialized once in src/main.jsx (guarded against double-init).
// If posthog isn't initialized anywhere, init once at app start:
//   posthog.init('phc_oLamCba6dgmoD8B4xsnFMtxczXvNABumYs6nKnmtBvwa', { api_host: 'https://us.i.posthog.com' });

function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  const read = (key) => p.get(key) || sessionStorage.getItem(key) || '';
  const u = {
    utm_source: read('utm_source'),
    utm_campaign: read('utm_campaign'),
    utm_content: read('utm_content')
  };
  // Keep extra tags when the visit arrived with them. Empty values stay off
  // the checkout URL so we don't invent blank parameters.
  for (const key of ['utm_medium', 'utm_term']) {
    const value = read(key).trim();
    if (value) u[key] = value;
  }
  Object.entries(u).forEach(([k, v]) => v && sessionStorage.setItem(k, v));
  return u;
}
function ensureId() {
  let id = sessionStorage.getItem('klyros_did');
  if (!id) { id = 'kly_' + crypto.randomUUID(); sessionStorage.setItem('klyros_did', id); }
  posthog.identify(id);
  return id;
}
const fb = (name, params = {}, id) =>
  window.fbq && window.fbq('track', name, params, id ? { eventID: id } : undefined);

// PRIVACY: never send quiz answers, health details, or typed notes to PostHog
// or Meta. Steps are identified by number only.

export function trackQuizStarted() {
  ensureId();
  posthog.capture('quiz_started', getUTMs());
  fb('Lead');
}
export function trackStep(n) {
  posthog.capture('quiz_step_completed', { step_number: n, step_name: `step_${n}` });
}
const HEADLINE_VARIANT = /^[a-z0-9_-]{1,40}$/;
export function trackEmailGateViewed() {
  // step6_headline is an optional PostHog flag. Only a short variant key is
  // sent. The on-screen headline does not change with the flag.
  const props = { step_number: 6, step_name: 'step_6' };
  try {
    const value = posthog.getFeatureFlag && posthog.getFeatureFlag('step6_headline');
    if (typeof value === 'string' && HEADLINE_VARIANT.test(value)) props.step6_headline = value;
    else if (value === true || value === false) props.step6_headline = String(value);
  } catch {
    // Flags are optional.
  }
  posthog.capture('quiz_email_gate_viewed', props);
}
export function trackLeadCaptured(hasFirstName) {
  // No email, name, or quiz answers — those stay off PostHog and Meta.
  posthog.capture('quiz_email_submitted', {
    step_number: 6,
    step_name: 'step_6',
    has_first_name: Boolean(hasFirstName)
  });
  posthog.capture('quiz_step_completed', { step_number: 6, step_name: 'step_6' });
}
export function trackOfferPageViewed() {
  posthog.capture('offer_page_viewed');
  fb('ViewContent');
}
export function setupScrollTracking() {
  const fired = {};
  const marks = [{ id:'proof-section', ev:'proof_section_viewed' }, { id:'offer-cards', ev:'offer_cards_viewed' }];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const m = marks.find((x) => x.id === e.target.id);
    if (e.isIntersecting && m && !fired[m.ev]) { fired[m.ev] = true; posthog.capture(m.ev); }
  }), { threshold: 0.4 });
  marks.forEach((m) => { const el = document.getElementById(m.id); if (el) io.observe(el); });
}
export function trackSendKitClicked(product, arch, price) {
  const id = 'ic_' + ensureId() + '_' + Date.now();
  posthog.capture('send_kit_clicked', { product, arch, price });
  fb('InitiateCheckout', { value: price, currency: 'USD', content_ids: [`${product}-${arch}`] }, id);
  return { did: sessionStorage.getItem('klyros_did'), ...getUTMs() };
}
