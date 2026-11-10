import React, { useEffect, useId, useRef, useState } from 'react';
import {
  EMAIL_CONSENT_DEFAULT,
  EMAIL_CONSENT_TEXT,
  SMS_CONSENT_DEFAULT,
  SMS_CONSENT_TEXT
} from '../lib/consent.js';
import {
  isValidEmail,
  phoneForLead,
  resolveEmailMarketingConsent,
  resolveSmsConsent
} from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { clearPendingQuizLead, rememberPendingQuizLead, scheduleLeadRetry } from '../lib/pendingLead.js';
import { trackEmailGateViewed, trackLeadCaptured } from '../lib/track.js';

const PLACEHOLDER_LABEL =
  'PLACEHOLDER: Flex Partial with kit on plain background, 3:2, 1800x1200px';

export default function EmailGate({
  initialEmail = '',
  initialPhone = '',
  initialEmailConsent = EMAIL_CONSENT_DEFAULT,
  initialSmsConsent = SMS_CONSENT_DEFAULT,
  onSuccess
}) {
  const emailId = useId();
  const phoneId = useId();
  const emailConsentId = useId();
  const smsConsentId = useId();
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [emailChecked, setEmailChecked] = useState(initialEmailConsent === true);
  const [smsChecked, setSmsChecked] = useState(initialSmsConsent === true);
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);
  const emailReady = isValidEmail(email);

  useEffect(() => {
    trackEmailGateViewed();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    if (lock.current) return;

    const nextEmail = email.trim();
    if (!isValidEmail(nextEmail)) return;
    const nextPhone = phoneForLead(phone);
    const localLead = {
      email: nextEmail,
      phone: nextPhone,
      emailMarketingConsent: resolveEmailMarketingConsent(emailChecked),
      smsConsent: resolveSmsConsent(smsChecked, nextPhone)
    };

    lock.current = true;
    setSubmitting(true);
    rememberPendingQuizLead(localLead);
    try {
      const saved = await persistQuizLead(localLead);
      clearPendingQuizLead();
      trackLeadCaptured();
      onSuccess(saved);
    } catch (error) {
      console.error('Lead save failed', error);
      onSuccess(localLead);
      scheduleLeadRetry(localLead);
    }
  }

  return (
    <main className="email-gate" data-screen-label="Email">
      <div className="email-gate-art" aria-hidden="true">
        <p>{PLACEHOLDER_LABEL}</p>
      </div>
      <h1 className="email-gate-title">Where should we send your results?</h1>

      <form onSubmit={onSubmit} noValidate>
        <div className="email-gate-fields">
          <div className="email-gate-field">
            <label htmlFor={emailId} className="email-gate-label">
              Email <span className="email-gate-tag">Required</span>
            </label>
            <input
              id={emailId}
              className="email-gate-input"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="email-gate-field">
            <label htmlFor={phoneId} className="email-gate-label">
              Phone <span className="email-gate-tag">Optional</span>
            </label>
            <input
              id={phoneId}
              className="email-gate-input"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={24}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

        </div>

        <div className="email-gate-consents">
          <label htmlFor={emailConsentId} className="email-gate-consent">
            <input
              id={emailConsentId}
              className="email-gate-check"
              name="email-marketing-consent"
              type="checkbox"
              checked={emailChecked}
              onChange={(event) => setEmailChecked(event.target.checked)}
            />
            <span className="email-gate-consent-copy">{EMAIL_CONSENT_TEXT}</span>
          </label>

          <label htmlFor={smsConsentId} className="email-gate-consent">
            <input
              id={smsConsentId}
              className="email-gate-check"
              name="sms-consent"
              type="checkbox"
              checked={smsChecked}
              onChange={(event) => setSmsChecked(event.target.checked)}
            />
            <span className="email-gate-consent-copy">{SMS_CONSENT_TEXT}</span>
          </label>
        </div>

        <button type="submit" className="email-gate-submit" disabled={!emailReady || submitting}>
          {submitting ? 'Sending…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}
