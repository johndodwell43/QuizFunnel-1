import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PRICING, money } from '../config.js';
import { cartUrl } from './checkout.js';
import { activeChoice, offerForAnswers, purchaseLine } from './offerMatch.js';

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

test('headline price stays the Flex match when Precision is selected', () => {
  const screen = readFileSync(new URL('../components/OfferScreen.jsx', import.meta.url), 'utf8');
  assert.match(screen, /data-match-price>\{money\(offer\.flex\.price\)\}/);
  assert.doesNotMatch(screen, /data-match-price>\{money\(active\.price\)\}/);
  assert.match(screen, /PLACEHOLDER: Flex Partial with kit on plain background/);

  const cases = [
    ['upper', PRICING.flexPrice, '$489'],
    ['lower', PRICING.flexPrice, '$489'],
    ['both', PRICING.flexBoth, '$879']
  ];
  for (const [arch, flexPrice, flexText] of cases) {
    const offer = offerForAnswers({ arch });
    const precision = activeChoice(offer, 'precision');
    assert.equal(offer.selected, 'flex');
    assert.equal(money(offer.flex.price), flexText);
    assert.equal(money(activeChoice(offer, 'flex').price), flexText);
    assert.equal(offer.flex.price, flexPrice);
    assert.notEqual(money(offer.flex.price), money(precision.price));
  }
});

test('checkout line matches the selected variant price and cart URL', () => {
  const screen = readFileSync(new URL('../components/OfferScreen.jsx', import.meta.url), 'utf8');
  assert.match(screen, /data-selected-offer>\{purchaseLine\(active\)\}/);
  assert.match(screen, /data-checkout href=\{active\.url\}/);

  const cases = [
    ['upper', 'flex', 'Flex Partial · $489', FLEX.upper],
    ['upper', 'precision', 'Precision Partial Pro · $789', PRECISION.upper],
    ['lower', 'flex', 'Flex Partial · $489', FLEX.lower],
    ['lower', 'precision', 'Precision Partial Pro · $789', PRECISION.lower],
    ['both', 'flex', 'Flex Partial · $879', FLEX.both],
    ['both', 'precision', 'Precision Partial Pro · $1,479', PRECISION.both]
  ];
  for (const [arch, selected, line, variantId] of cases) {
    const choice = activeChoice(offerForAnswers({ arch }), selected);
    assert.equal(purchaseLine(choice), line);
    assert.equal(choice.price, Number(line.replace(/[^0-9]/g, '')));
    assert.equal(choice.url, cart(variantId));
    assert.match(choice.url, new RegExp(`/cart/${choice.variantId}:1\\?discount=KLYROS50`));
  }
});

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

test('result photo follows arch and tooth count (1-6, 6+ and most use 6)', async () => {
  const { partialImage, teethCount, archOptions } = await import('./offerMatch.js');
  assert.equal(partialImage('upper', '1'), '/images/partials/upper-1.jpg');
  assert.equal(partialImage('lower', '4'), '/images/partials/lower-4.jpg');
  assert.equal(partialImage('upper', '6+'), '/images/partials/upper-6.jpg');
  assert.equal(partialImage('lower', 'most'), '/images/partials/lower-6.jpg');
  assert.equal(teethCount(''), 1);
  assert.deepEqual(archOptions('upper'), ['upper']);
  assert.deepEqual(archOptions('lower'), ['lower']);
  assert.deepEqual(archOptions('both'), ['both', 'upper', 'lower']);
});

test('tooth counts go to the cart as order attributes', async () => {
  const { toothAttributes } = await import('./offerMatch.js');
  assert.deepEqual(toothAttributes('upper', { upper: '2', lower: '5' }), { 'attributes[Top teeth to replace]': '2' });
  assert.deepEqual(toothAttributes('lower', { upper: '2', lower: '5' }), { 'attributes[Bottom teeth to replace]': '5' });
  assert.deepEqual(toothAttributes('both', { upper: '2', lower: '3' }), {
    'attributes[Top teeth to replace]': '2',
    'attributes[Bottom teeth to replace]': '3'
  });
  const url = cartUrl('63304032354673', toothAttributes('both', { upper: '2', lower: '3' }));
  assert.match(url, /attributes%5BTop\+teeth\+to\+replace%5D=2/);
  assert.match(url, /discount=KLYROS50$/);
});

test('second arch later costs the both-arch total minus one arch', () => {
  const one = offerForAnswers({ arch: 'upper' });
  const both = offerForAnswers({ arch: 'both' });
  assert.equal(both.flex.price - one.flex.price, 390);
  assert.equal(both.precision.price - one.precision.price, 690);
  const screen = readFileSync(new URL('../components/OfferScreen.jsx', import.meta.url), 'utf8');
  assert.match(screen, /we'll take \{money\(secondArchOff\)\} off your second arch/);
  assert.equal(2 * one.flex.price - both.flex.price, 99);
  assert.equal(2 * one.precision.price - both.precision.price, 99);
});
