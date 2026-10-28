// Single source of truth for pricing and checkout hand-off.
// Product prices match Shopify. Affirm is named with no monthly amount, APR, or term length.
export const PRICING = {
  flexPrice: 489,
  flexSecondArch: 370,
  precisionPrice: 789,
  precisionSecondArch: 690
};

export const AFFIRM_LINE = 'Pay over time with Affirm';

export const CHECKOUT = {
  flex: 'https://klyrosdental.com/products/flexible-partial-denture',
  precision: 'https://klyrosdental.com/products/pmma-milled-partial-denture'
};

export const LINKS = {
  home: 'https://www.klyrosdental.com',
  refund: 'https://www.klyrosdental.com/refund-policy',
  fitAssurance: 'https://www.klyrosdental.com/fit-assurance',
  privacy: 'https://www.klyrosdental.com/privacy-policy',
  email: 'help@klyrosdental.com'
};

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
