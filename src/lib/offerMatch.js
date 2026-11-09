import { PRICING } from '../config.js';
import { CART_VARIANTS, archFromAnswer, cartUrl } from './checkout.js';

function choice(sku, arch) {
  const price = arch === 'both'
    ? (sku === 'flex' ? PRICING.flexBoth : PRICING.precisionBoth)
    : (sku === 'flex' ? PRICING.flexPrice : PRICING.precisionPrice);
  const variantId = CART_VARIANTS[sku][arch];
  return {
    sku,
    name: sku === 'flex' ? 'Flex Partial' : 'Precision Partial Pro',
    price,
    variantId,
    url: cartUrl(variantId)
  };
}

// Q1 arch picks the variant. Q2 and the later answers do not change the product.
// Flex is the primary match. Precision is the same arch, shown second.
export function offerForAnswers(answers = {}) {
  const arch = archFromAnswer(answers.arch);
  return {
    arch,
    selected: 'flex',
    flex: choice('flex', arch),
    precision: choice('precision', arch)
  };
}
