import React, { useEffect, useId, useRef, useState } from 'react';
import {
  EMAIL_CONSENT_DEFAULT,
  EMAIL_CONSENT_TEXT,
  SMS_CONSENT_DEFAULT,
  SMS_CONSENT_TEXT
} from '../lib/consent.js';
import {
  isValidEmail,
  normalizeFirstName,
  normalizePhone,
  resolveEmailMarketingConsent,
  resolveSmsConsent
} from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { trackEmailGateViewed, trackLeadCaptured } from '../lib/track.js';

export default function EmailGate({
  initialEmail = '',
  initialFirstName = '',
  initialPhone = '',
  initialEmailConsent = EMAIL_CONSENT_DEFAULT,
  initialSmsConsent = SMS_CONSENT_DEFAULT,
  onSuccess
}) {
  const emailId = useId();
  const nameId = useId();
  const phoneId = useId();
  const emailConsentId = useId();
  const smsConsentId = useId();
  const errorId = useId();
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [phone, setPhone] = useState(initialPhone);
  const [emailChecked, setEmailChecked] = useState(initialEmailConsent === true);
  const [smsChecked, setSmsChecked] = useState(initialSmsConsent === true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    trackEmailGateViewed();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    if (lock.current) return;

    const nextEmail = email.trim();
    const nextName = normalizeFirstName(firstName);
    const nextPhone = normalizePhone(phone);
    if (!isValidEmail(nextEmail)) {
      setError('Enter a valid email to continue.');
      return;
    }
    if (nextName === null) {
      setError('Use just your first name, or leave it blank.');
      return;
    }
    if (nextPhone === null) {
      setError('Enter a valid phone number, or leave it blank.');
      return;
    }

    lock.current = true;
    setSubmitting(true);
    setError('');
    try {
      const saved = await persistQuizLead({
        email: nextEmail,
        firstName: nextName,
        phone: nextPhone,
        emailMarketingConsent: resolveEmailMarketingConsent(emailChecked),
        smsConsent: resolveSmsConsent(smsChecked, nextPhone)
      });
      trackLeadCaptured();
      onSuccess(saved);
    } catch {
      lock.current = false;
      setError("We couldn't save your email. Check it and try again.");
      setSubmitting(false);
    }
  }

  const phoneInvalid = error === 'Enter a valid phone number, or leave it blank.';

  return (
    <main className="email-gate" data-screen-label="Email">
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
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
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
              aria-invalid={phoneInvalid}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div className="email-gate-field email-gate-field-wide">
            <label htmlFor={nameId} className="email-gate-label">
              First name <span className="email-gate-tag">Optional</span>
            </label>
            <input
              id={nameId}
              className="email-gate-input"
              name="given-name"
              type="text"
              autoComplete="given-name"
              maxLength={40}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
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

        {error ? (
          <p id={errorId} className="email-gate-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="email-gate-submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}
