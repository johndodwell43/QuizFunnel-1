import posthog from 'posthog-js';

// PostHog is initialized once in src/main.jsx (guarded against double-init).
// If posthog isn't initialized anywhere, init once at app start:
//   posthog.init('phc_oLamCba6dgmoD8B4xsnFMtxczXvNABumYs6nKnmtBvwa', { api_host: 'https://us.i.posthog.com' });

function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  const u = {
    utm_source:  p.get('utm_source')  || sessionStorage.getItem('utm_source')  || '',
    utm_campaign:p.get('utm_campaign')|| sessionStorage.getItem('utm_campaign')|| '',
    utm_content: p.get('utm_content') || sessionStorage.getItem('utm_content') || '',
  };
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

// Matches the live 5-question quiz (src/data/questions.js).
const STEP_NAMES = { 1:'teeth_location', 2:'teeth_count', 3:'recent_extraction', 4:'pain_swelling', 5:'loose_teeth' };

export function trackQuizStarted() {
  ensureId();
  posthog.capture('quiz_started', getUTMs());
  fb('Lead');
}
export function trackStep(n, answer) {
  posthog.capture('quiz_step_completed', { step_number: n, step_name: STEP_NAMES[n], answer });
}
export function trackDisqualified(reason) {
  posthog.capture('quiz_disqualified', { reason });
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
