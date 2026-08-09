const SHOP = 'klyroscare.myshopify.com'; // confirm this is your checkout domain

const VARIANTS = {
  flex:      { upper: '63304031961457', lower: '63304032158065', both: '63304032354673' }, // 489/489/859
  precision: { upper: '63304040481137', lower: '63304040677745', both: '63304040874353' }, // 789/789/1479
};

const archFromStep1 = (a = '') =>
  /both/i.test(a) ? 'both' : /lower/i.test(a) ? 'lower' : 'upper';

function go(variantId, tracking = {}) {
  const qs = new URLSearchParams(tracking).toString();
  window.location.href = `https://${SHOP}/cart/${variantId}:1${qs ? '?' + qs : ''}`;
}

export function checkoutOneArch(sku, step1Answer, tracking) {
  go(VARIANTS[sku][archFromStep1(step1Answer)], tracking);
}
export function checkoutBothArches(sku, tracking) {
  go(VARIANTS[sku].both, tracking);
}
