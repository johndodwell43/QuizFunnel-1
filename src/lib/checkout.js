const SHOP = 'tfvziu-ia.myshopify.com';

// upper1 / lower1 = the 1-tooth variants (Shopify "Upper · 1 tooth" / "Lower · 1 tooth").
export const CART_VARIANTS = {
  flex:      { upper: '63304031961457', lower: '63304032158065', both: '63304032354673', upper1: '68500112015729', lower1: '68500112048497' },
  precision: { upper: '63304040481137', lower: '63304040677745', both: '63304040874353', upper1: '68500112179569', lower1: '68500112212337' }
};


export const archFromAnswer = (answer = '') =>
  /both/i.test(answer) ? 'both' : /lower/i.test(answer) ? 'lower' : 'upper';

export function cartUrl(variantId, tracking = {}) {
  const params = new URLSearchParams();
  Object.entries(tracking).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, String(value));
  });
  const qs = params.toString();
  return `https://${SHOP}/cart/${variantId}:1${qs ? `?${qs}` : ''}`;
}

function go(variantId, tracking = {}) {
  window.location.href = cartUrl(variantId, tracking);
}

export function checkoutOneArch(sku, step1Answer, tracking) {
  go(CART_VARIANTS[sku][archFromAnswer(step1Answer)], tracking);
}
export function checkoutVariant(variantId, tracking) {
  go(variantId, tracking);
}
export function checkoutBothArches(sku, tracking) {
  go(CART_VARIANTS[sku].both, tracking);
}
