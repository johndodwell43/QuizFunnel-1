import { SMS_REWARD } from '../config.js';

const ATTR_KEY = 'klyros_attr';
const REWARD_KEY = 'klyros_sms_reward';
const EMAIL_CODE_KEY = 'klyros_email_code';

function store() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

// First touch in this visit: where did they come from?
export function captureAttribution(search = typeof window !== 'undefined' ? window.location.search : '') {
  const s = store();
  try {
    if (s && s.getItem(ATTR_KEY)) return JSON.parse(s.getItem(ATTR_KEY));
  } catch {
    // fall through and re-read the URL
  }
  const p = new URLSearchParams(search);
  const attr = {
    source: (p.get('utm_source') || '').toLowerCase(),
    medium: (p.get('utm_medium') || '').toLowerCase(),
    clicked: Boolean(p.get('fbclid') || p.get('gclid') || p.get('ttclid') || p.get('msclkid'))
  };
  try {
    if (s) s.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    // private mode: still works for this page view
  }
  return attr;
}

// True only for links we hand out ourselves, never for ad clicks.
export function isTaggedLink(attr = captureAttribution()) {
  if (attr.clicked) return false;
  if (['paid', 'cpc', 'ppc', 'paid_social', 'paidsocial'].includes(attr.medium)) return false;
  return SMS_REWARD.taggedSources.includes(attr.source);
}

// A credit code from one of our emails: ?discount=HELD-XXXX on the link. Only our own "HELD-" codes
// count, so nobody can hand themselves a different code by typing it into the address bar.
export function emailCodeFrom(search = '') {
  const raw = (new URLSearchParams(search).get('discount') || '').trim();
  return /^HELD-[A-Z0-9-]{4,40}$/i.test(raw) ? raw : '';
}

// The email credit code for this visit. Read from the link the first time, then remembered.
export function emailCode(search = typeof window !== 'undefined' ? window.location.search : '') {
  const fromLink = emailCodeFrom(search);
  const s = store();
  try {
    if (fromLink) {
      s?.setItem(EMAIL_CODE_KEY, fromLink);
      return fromLink;
    }
    return s?.getItem(EMAIL_CODE_KEY) || '';
  } catch {
    return fromLink;
  }
}

// The text reward is offered only on our tagged links, and never on top of an email credit.
export function textRewardOffered() {
  return !emailCode() && isTaggedLink();
}

export function markRewardEarned() {
  try {
    store()?.setItem(REWARD_KEY, '1');
  } catch {
    // ignore
  }
}

export function rewardEarned() {
  if (emailCode()) return false;   // one discount per order: the email credit wins
  try {
    return store()?.getItem(REWARD_KEY) === '1';
  } catch {
    return false;
  }
}

// Cart params for checkout: one discount code at most. An email credit wins; otherwise the text
// reward code, and only when it was earned.
export function rewardParams() {
  const code = emailCode();
  if (code) return { discount: code };
  return rewardEarned() ? { discount: SMS_REWARD.code } : {};
}
