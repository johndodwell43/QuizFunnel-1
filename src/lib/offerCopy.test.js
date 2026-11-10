import assert from 'node:assert/strict';
import test from 'node:test';
import { money } from '../config.js';
import { FAQ_COPY, INCLUDED_COPY, NEXT_STEPS, includedProductLine } from './offerCopy.js';
import { activeChoice, offerForAnswers } from './offerMatch.js';

const BANNED = /guarantee|remake|\bfit\b|free|today|limited|candidate|qualify|approved|recommended|other brands/i;

test('included card strings stay inside the approved facts', () => {
  const strings = [
    INCLUDED_COPY.heading,
    INCLUDED_COPY.dentist,
    INCLUDED_COPY.kit,
    INCLUDED_COPY.shipping,
    INCLUDED_COPY.archUpper,
    INCLUDED_COPY.archLower,
    INCLUDED_COPY.archBoth
  ];
  assert.deepEqual(strings, [
    "What's included",
    'A partner dentist licensed in your state reviews your photos.',
    'Kit',
    'Prepaid, tracked 2-day shipping.',
    'Upper',
    'Lower',
    'Both'
  ]);
  for (const line of strings) assert.doesNotMatch(line, BANNED);
});

test('FAQ and What\'s next share the scored step answers in order', () => {
  assert.deepEqual(FAQ_COPY.map(([title, body]) => [title, body]), [
    ['Dentist review', "A partner dentist licensed in your state reviews your photos and decides whether it's a fit."],
    ['Kit', 'A kit is sent to you to take your impressions.'],
    ['U.S. lab', 'A U.S. lab makes your partial from your impressions.'],
    ['Shipping', 'Prepaid, tracked 2-day shipping.']
  ]);
  assert.deepEqual(NEXT_STEPS.map(([title, body]) => [title, body]), FAQ_COPY.slice(0, 3));
});

test('included product line uses the selected name, arch, and Shopify price', () => {
  const cases = [
    ['upper', 'flex', 'Flex Partial · Upper · $489'],
    ['lower', 'flex', 'Flex Partial · Lower · $489'],
    ['both', 'flex', 'Flex Partial · Both · $859'],
    ['upper', 'precision', 'Precision Partial Pro · Upper · $789'],
    ['lower', 'precision', 'Precision Partial Pro · Lower · $789'],
    ['both', 'precision', 'Precision Partial Pro · Both · $1,479']
  ];
  for (const [arch, selected, line] of cases) {
    const choice = activeChoice(offerForAnswers({ arch }), selected);
    assert.equal(includedProductLine(choice.name, arch, money(choice.price)), line);
    assert.equal(choice.url.includes(choice.variantId), true);
  }
});
