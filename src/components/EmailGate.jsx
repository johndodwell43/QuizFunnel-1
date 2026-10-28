import React, { useEffect, useId, useRef, useState } from 'react';
import { isValidEmail, normalizeFirstName } from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { trackEmailGateViewed, trackLeadCaptured } from '../lib/track.js';

const labelStyle = {
  display: 'block',
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 8,
  color: '#111827'
};

const inputStyle = {
  width: '100%',
  minHeight: 56,
  borderRadius: 16,
  border: 'none',
  background: '#ffffff',
  boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
  fontSize: 18,
  padding: '14px 16px',
  boxSizing: 'border-box',
  color: '#111827'
};

export default function EmailGate({ answers, initialEmail = '', initialFirstName = '', onSuccess }) {
  const emailId = useId();
  const nameId = useId();
  const errorId = useId();
  const microId = useId();
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);
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
    if (!isValidEmail(nextEmail)) {
      setError('Enter a valid email to see your results.');
      return;
    }
    if (nextName === null) {
      setError('Use just your first name, or leave it blank.');
      return;
    }

    lock.current = true;
    setSubmitting(true);
    setError('');
    try {
      const saved = await persistQuizLead({
        email: nextEmail,
        firstName: nextName,
        answers
      });
      trackLeadCaptured();
      onSuccess(saved);
    } catch {
      lock.current = false;
      setError("We couldn't save your email. Check it and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main data-screen-label="Send results">
      <h1
        style={{
          fontSize: 'clamp(34px, 5.5vw, 44px)',
          lineHeight: 1.15,
          fontWeight: 700,
          margin: '0 0 20px 0',
          textWrap: 'pretty'
        }}
      >
        Where should we send your results?
      </h1>

      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor={emailId} style={labelStyle}>
            Email <span style={{ fontWeight: 400, color: '#5b6472' }}>(required)</span>
          </label>
          <input
            id={emailId}
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
            aria-describedby={error ? `${microId} ${errorId}` : microId}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor={nameId} style={labelStyle}>
            First name <span style={{ fontWeight: 400, color: '#5b6472' }}>(optional)</span>
          </label>
          <input
            id={nameId}
            name="given-name"
            type="text"
            autoComplete="given-name"
            maxLength={40}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            style={inputStyle}
          />
        </div>

        <p id={microId} style={{ fontSize: 16, lineHeight: 1.5, color: '#5b6472', margin: '0 0 18px 0' }}>
          We'll email your results. No spam. Unsubscribe anytime.
        </p>

        {error ? (
          <p id={errorId} role="alert" style={{ fontSize: 16, lineHeight: 1.45, color: '#9b2c2c', margin: '0 0 14px 0' }}>
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            minHeight: 66,
            border: 'none',
            borderRadius: 16,
            background: submitting ? '#8ea6ef' : '#2F5BEA',
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 700,
            cursor: submitting ? 'wait' : 'pointer'
          }}
        >
          {submitting ? 'Sending…' : 'See my results'}
        </button>
      </form>
    </main>
  );
}
