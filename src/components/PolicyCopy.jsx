import React from 'react';
import { LINKS } from '../config.js';

// Fit-assurance and order-terms copy. Wording lives here, not in individual components.

export const CHECKOUT_TERMS_TEXT =
  'Custom-made for you, so orders are final once sent to the lab. Cancel before then for a refund minus a $59.99 service fee.';

// Short version: trust lines and cards. "Terms apply" links to the official page.
export function FitAssuranceShort() {
  return (
    <>
      60-Day Fit Assurance™: up to 3 dentist-reviewed adjustments within 60 days of delivery.{' '}
      <a href={LINKS.fitAssurance} style={{ color: 'inherit', textDecoration: 'underline' }}>Terms apply</a>.
    </>
  );
}
