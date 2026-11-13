import { PRICING, money } from '../config.js';
import { CART_VARIANTS, archFromAnswer, cartUrl } from './checkout.js';
export { archFromAnswer };

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

export function purchaseLine(choice) {
  return `${choice.name} · ${money(choice.price)}`;
}

export function activeChoice(offer, selected = offer.selected) {
  switch (selected) {
    case 'flex':
      return offer.flex;
    case 'precision':
      return offer.precision;
    default: {
      const unknown = selected;
      throw new Error(`Unknown offer selection: ${String(unknown)}`);
    }
  }
}

// Q2 answer → tooth count for the product photo (1–6; 6+ and "most" use 6).
export function teethCount(answer = '') {
  const legacy = { '2-3': 3, '4-6': 6, most: 6 };
  if (legacy[answer]) return legacy[answer];
  const n = parseInt(answer, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 6);
}

// Photo of the partial. Same price for every tooth count, so one clean product shot covers
// every arch and count (public/images/partials/flex-partial.webp).
export function partialImage(arch, teeth) {
  return '/images/partials/flex-partial.webp';
}

// One arch answered → only that arch is offered.
// Both answered → both arches first, with the option to start with one.
export function archOptions(answerArch) {
  const arch = archFromAnswer(answerArch);
  return arch === 'both' ? ['both', 'upper', 'lower'] : [arch];
}

// Tooth counts ride along to the Shopify order as cart attributes (shown in the order's Notes).
export function toothAttributes(arch, teeth = {}) {
  const out = {};
  if (arch !== 'lower') out['attributes[Top teeth to replace]'] = teeth.upper || '1';
  if (arch !== 'upper') out['attributes[Bottom teeth to replace]'] = teeth.lower || '1';
  return out;
}
