// Single source of truth for pricing and checkout hand-off.
export const PRICING = {
  flexPrice: 489,
  flexSecondArch: 370,
  precisionPrice: 789,
  precisionSecondArch: 690,
  // Affirm is offered with no dollar amount, APR, or month count.
  flexMonthly: 'pay over time with Affirm. Checking your rate won\'t hurt your credit score.',
  precisionMonthly: 'pay over time with Affirm.'
};

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

// Public company id from the Klaviyo onsite embed already installed on
// tfvziu-ia.myshopify.com (Klaviyo Email Marketing & SMS). Not a private key.
// Onsite forms are off and the theme publishes no list id, so quiz leads are
// written to this account with the client Profiles + Events APIs.
export const KLAVIYO = {
  companyId: 'XaqymG',
  revision: '2024-10-15',
  source: 'quiz_results_gate',
  metric: 'Quiz Results Requested'
};
