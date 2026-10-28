import React from 'react';
import { LINKS } from '../config.js';

// Fit and order-terms copy. Change the wording here, not in individual
// components. Do not describe adjustments or shipping as free. The $199
// Priority Remake is the flat rate after 3 DDS-reviewed adjustments.
// https://www.klyrosdental.com/fit-assurance and /refund-policy

export const CHECKOUT_TERMS_TEXT =
  'Custom-made for you, so orders are final once sent to the lab. Cancel before then for a refund minus a $59.99 service fee.';

// Short version: trust lines and cards. "Terms apply" links to the official page.
export function FitAssuranceShort() {
  return (
    <>
      60-Day Fit Assurance™: up to 3 DDS-reviewed adjustments within 60 days of delivery, then a $199 Priority Remake.{' '}
      <a href={LINKS.fitAssurance} style={{ color: 'inherit', textDecoration: 'underline' }}>Terms apply</a>.
    </>
  );
}
