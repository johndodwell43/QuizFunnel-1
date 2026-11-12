// Single source of truth for pricing and checkout hand-off.
// Both-arch amounts are the Shopify variant prices, not a derived discount.
export const PRICING = {
  flexPrice: 489,
  flexBoth: 879,
  precisionPrice: 789,
  precisionBoth: 1479
};

// Locked lines. Do not add a dollar amount, APR, or month count to Affirm.
export const AFFIRM_LINE = 'flexible payment plans at checkout';
export const SHIPPING_LINE = 'Shipping details at checkout';
export const DENTIST_LINE =
  'A licensed dentist in your state reviews your case before anything is made.';

export const CHECKOUT = {
  flex: 'https://klyrosdental.com/products/flexible-partial-denture',
  precision: 'https://klyrosdental.com/products/pmma-milled-partial-denture'
};

export const LINKS = {
  home: 'https://www.klyrosdental.com',
  refund: 'https://www.klyrosdental.com/refund-policy',
  terms: 'https://www.klyrosdental.com/policies/terms-of-service',
  privacy: 'https://www.klyrosdental.com/privacy-policy',
  email: 'help@klyrosdental.com'
};

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

// Text-signup reward. Only visitors who arrive from links WE tag (utm_source below) and add their
// phone get it. Ads, Google, direct visits: no discount (they can still opt in for order updates).
// A visit with an ad click id (fbclid/gclid/ttclid) or utm_medium paid/cpc never counts as tagged.
export const SMS_REWARD = {
  amount: 50,
  code: 'KLYROS50',
  taggedSources: ['ig_bio', 'tt_bio', 'yt_bio', 'fb_bio', 'linktree', 'klaviyo', 'email', 'sms', 'organic']
};
