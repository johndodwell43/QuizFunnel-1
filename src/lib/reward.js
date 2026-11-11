import { SMS_REWARD } from '../config.js';

const ATTR_KEY = 'klyros_attr';
const REWARD_KEY = 'klyros_sms_reward';

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

export function markRewardEarned() {
  try {
    store()?.setItem(REWARD_KEY, '1');
  } catch {
    // ignore
  }
}

export function rewardEarned() {
  try {
    return store()?.getItem(REWARD_KEY) === '1';
  } catch {
    return false;
  }
}

// Cart params for checkout: the discount code only when the reward was earned.
export function rewardParams() {
  return rewardEarned() ? { discount: SMS_REWARD.code } : {};
}
