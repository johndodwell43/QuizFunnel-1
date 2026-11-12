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

const DENTIST_REVIEW = "A partner dentist licensed in your state reviews your photos and decides whether it's a fit.";
const KIT_STEP = 'A kit is sent to you to take your impressions.';
const LAB_STEP = 'A licensed U.S. dental lab makes your partial from your impressions.';

export const FAQ_COPY = [
  ['Dentist review', DENTIST_REVIEW],
  ['Kit', KIT_STEP],
  ['U.S. lab', LAB_STEP],
  ['Shipping', INCLUDED_COPY.shipping]
];

export const NEXT_HEADING = "What's next";

export const NEXT_STEPS = [
  ['Dentist review', DENTIST_REVIEW, 'PLACEHOLDER: partial product shot on plain background, 1:1, 800px'],
  ['Kit', KIT_STEP, 'PLACEHOLDER: kit on plain background, 1:1, 800px'],
  ['U.S. lab', LAB_STEP, 'PLACEHOLDER: finished partial on plain background, 1:1, 800px']
];

// Quiz result page: what happens after they pay, in order.
export const ORDER_STEPS = [
  ['Your kit ships', 'Take your impressions with the step-by-step guide, then send them back.'],
  ['A dentist reviews your case', DENTIST_REVIEW],
  ['A U.S. lab makes your partial', 'It is made from your own impressions and shipped to you.']
];

// Quiz result page questions, written the way buyers ask them.
export const QUIZ_FAQ = [
  ['Who checks that this is right for me?', DENTIST_REVIEW],
  ['How do I take my impressions?', KIT_STEP + ' The step-by-step guide walks you through it.'],
  ['Who makes my partial?', LAB_STEP],
  ['What if the dentist says it\'s not a fit?', 'Nothing is made until a dentist reviews your case. See our refund policy for what happens next.']
];

// "What you get with Klyros" rows on the case results page. Every line is a fact about how Klyros works.
// [icon, row title, what you get, why it matters]
export const WHY_ROWS = [
  ['tooth', 'Dentist case review', 'A licensed dentist reviews your case', 'Nothing is made until they say yes.'],
  ['box', 'Impression kit', 'Kit and step-by-step guide included', 'App, visual guide and PDF walk you through it.'],
  ['lab', 'Certified dental tech', 'Licensed U.S. dental labs fabricate your appliance', 'Made using your custom mouth impressions.'],
  ['truck', 'Shipping', '2-day shipping both ways, included', 'Tracked, with an update at every step.'],
  ['wrench', 'Fit', 'Adjustments and 1 remake included', 'If the fit needs work, we adjust it or remake it once.'],
  ['chat', 'Support', 'Live chat with real people', 'Message us any time you need help.']
];
