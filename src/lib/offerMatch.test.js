import assert from 'node:assert/strict';
import test from 'node:test';
import { PRICING } from '../config.js';
import { cartUrl } from './checkout.js';
import { offerForAnswers } from './offerMatch.js';

const FLEX = {
  upper: '63304031961457',
  lower: '63304032158065',
  both: '63304032354673'
};

const PRECISION = {
  upper: '63304040481137',
  lower: '63304040677745',
  both: '63304040874353'
};

function cart(variantId) {
  return `https://tfvziu-ia.myshopify.com/cart/${variantId}:1?discount=KLYROS50`;
}

for (const arch of ['upper', 'lower', 'both']) {
  test(`${arch} preselects the Flex cart and lists Precision for the same arch`, () => {
    const offer = offerForAnswers({
      arch,
      teeth: 'most',
      extraction: 'no',
      pain: 'yes',
      loose: 'yes'
    });
    const price = arch === 'both' ? PRICING.flexBoth : PRICING.flexPrice;
    const precisionPrice = arch === 'both' ? PRICING.precisionBoth : PRICING.precisionPrice;

    assert.equal(offer.selected, 'flex');
    assert.equal(offer.arch, arch);
    assert.equal(offer.flex.url, cart(FLEX[arch]));
    assert.equal(offer.precision.url, cart(PRECISION[arch]));
    assert.equal(offer.flex.price, price);
    assert.equal(offer.precision.price, precisionPrice);
    assert.match(offer.flex.url, /discount=KLYROS50/);
    assert.match(offer.precision.url, /discount=KLYROS50/);

    const otherTeeth = offerForAnswers({ arch, teeth: '1' });
    assert.equal(otherTeeth.flex.url, offer.flex.url);
    assert.equal(otherTeeth.precision.url, offer.precision.url);
  });
}

test('discount is appended after existing cart params and is not repeated', () => {
  const withTracking = cartUrl('63304031961457', {
    did: 'kly_1',
    utm_source: '',
    utm_campaign: 'spring',
    utm_content: ''
  });
  assert.equal(
    withTracking,
    'https://tfvziu-ia.myshopify.com/cart/63304031961457:1?did=kly_1&utm_source=&utm_campaign=spring&utm_content=&discount=KLYROS50'
  );

  const already = cartUrl('63304032158065', { did: 'kly_2', discount: 'KLYROS50' });
  assert.equal(
    already,
    'https://tfvziu-ia.myshopify.com/cart/63304032158065:1?did=kly_2&discount=KLYROS50'
  );
});
