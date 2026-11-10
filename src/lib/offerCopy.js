import { DENTIST_LINE } from '../config.js';

// One block for the What's included cards. Product name, arch, and price
// are filled from the selected Shopify variant.
export const INCLUDED_COPY = {
  heading: "What's included",
  dentist: 'A partner dentist licensed in your state reviews your photos.',
  kit: 'Kit',
  shipping: 'Prepaid, tracked 2-day shipping.',
  archUpper: 'Upper',
  archLower: 'Lower',
  archBoth: 'Both'
};

const ARCH_LABEL = {
  upper: INCLUDED_COPY.archUpper,
  lower: INCLUDED_COPY.archLower,
  both: INCLUDED_COPY.archBoth
};

export function includedArchLabel(arch) {
  return ARCH_LABEL[arch];
}

export function includedProductLine(name, arch, priceText) {
  return `${name} · ${includedArchLabel(arch)} · ${priceText}`;
}

// How it works titles and bodies. The kit step uses "kit" in place of
// "impression kit". Shipping uses the allowed shipping sentence.
export const FAQ_COPY = [
  ['Kit', 'A kit is sent to you. Take as many mold tries as you need.'],
  ['Dentist review', DENTIST_LINE],
  ['U.S. lab', 'A U.S. lab makes the partial from the impressions the dentist reviewed.'],
  ['Shipping', INCLUDED_COPY.shipping]
];

export const NEXT_HEADING = "What's next";

export const NEXT_STEPS = [
  ['Kit', 'A kit is sent to you. Take as many mold tries as you need.', 'PLACEHOLDER: kit on plain background, 1:1, 800px'],
  ['Dentist review', DENTIST_LINE, 'PLACEHOLDER: partial product shot on plain background, 1:1, 800px'],
  ['U.S. lab', 'A U.S. lab makes the partial from the impressions the dentist reviewed.', 'PLACEHOLDER: finished partial on plain background, 1:1, 800px']
];
