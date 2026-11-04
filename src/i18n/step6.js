import { QUIZ_CREDIT_ENABLED } from '../config.js';

// English is the only reviewed copy. Spanish is stored so a reviewer can
// replace it later. Nothing in this module renders the Spanish strings.
export const STEP6_LOCALE = 'en';
export const STEP6_ES_STATUS = 'PENDING HUMAN REVIEW';

export const STEP6_EN = {
  h1: 'Where should we send your results?',
  subhead: "We'll email your partial options and your price.",
  emailLabel: 'Email',
  firstNameLabel: 'First name',
  firstNameHelper: '(optional, so we know what to call you)',
  button: 'Show my results',
  privacy: 'We only save your email and first name. Unsubscribe anytime.',
  privacyLink: 'Privacy Policy',
  emailError: 'Please enter a valid email so we can send your results.',
  nameError: 'Use a first name, or leave it blank.',
  saveError: "We couldn't save that just now. Please try again."
};

export const STEP6_ES = {
  h1: 'PENDING HUMAN REVIEW',
  subhead: 'PENDING HUMAN REVIEW',
  emailLabel: 'PENDING HUMAN REVIEW',
  firstNameLabel: 'PENDING HUMAN REVIEW',
  firstNameHelper: 'PENDING HUMAN REVIEW',
  button: 'PENDING HUMAN REVIEW',
  privacy: 'PENDING HUMAN REVIEW',
  privacyLink: 'PENDING HUMAN REVIEW',
  emailError: 'PENDING HUMAN REVIEW',
  nameError: 'PENDING HUMAN REVIEW',
  saveError: 'PENDING HUMAN REVIEW'
};

// Optional PostHog flag `step6_headline` is recorded for analytics only.
// It cannot change the headline: the only approved string is STEP6_EN.h1.
export function step6Headline(_flagValue) {
  return STEP6_EN.h1;
}

// Store-credit wording stays omitted. QUIZ_CREDIT_ENABLED must be false,
// and there is no credit sentence to append even if that flag is flipped,
// until real codes exist and John unlocks a reviewed line.
export function step6Subhead() {
  if (QUIZ_CREDIT_ENABLED) return STEP6_EN.subhead;
  return STEP6_EN.subhead;
}
