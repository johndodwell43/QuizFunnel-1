// Single source of truth for pricing and checkout hand-off.
export const PRICING = {
  flexPrice: 489,
  flexSecondArch: 370,
  precisionPrice: 789,
  precisionSecondArch: 690,
  flexMonthly: '$41 a month with Affirm. Checking your rate won\'t hurt your credit score.',
  precisionMonthly: '$66 a month for 12 months with Affirm.'
};

export const CHECKOUT = {
  flex: 'https://klyrosdental.com/products/flexible-partial-denture',
  precision: 'https://klyrosdental.com/products/pmma-milled-partial-denture'
};

export const LINKS = {
  home: 'https://klyrosdental.com',
  refund: 'https://klyrosdental.com/policies/refund-policy',
  fitAssurance: 'https://klyrosdental.com/pages/fit-assurance',
  privacy: 'https://klyrosdental.com/policies/privacy-policy',
  email: 'help@klyrosdental.com'
};

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

// Appends the quiz answers so the product page can preselect the right variant.
export function buildCheckoutHref(base, answers, flagged) {
  const params = new URLSearchParams({
    arch: answers.arch || '',
    teeth: answers.teeth || '',
    flagged: flagged ? '1' : '0',
    utm_source: 'quiz'
  });
  return base + '?' + params.toString();
}
