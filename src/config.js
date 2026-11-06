// Single source of truth for pricing and checkout hand-off.
// Both-arch amounts are the Shopify variant prices, not a derived discount.
export const PRICING = {
  flexPrice: 489,
  flexBoth: 859,
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
  privacy: 'https://www.klyrosdental.com/privacy-policy',
  email: 'help@klyrosdental.com'
};

// TODO: pending John cut of full refund line on ToS
export const TERMS_URL = '#';

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
