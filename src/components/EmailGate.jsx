import React, { useState } from 'react';
import { isValidEmail } from '../lib/lead.js';

const fieldLabel = {
  display: 'block',
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 6,
  color: '#111827'
};

const fieldInput = {
  width: '100%',
  minHeight: 56,
  boxSizing: 'border-box',
  border: '1px solid #e6eaf2',
  borderRadius: 16,
  background: '#ffffff',
  padding: '14px 16px',
  fontSize: 18,
  fontFamily: 'inherit',
  color: '#111827'
};

export default function EmailGate({ initialEmail = '', initialFirstName = '', onSubmit }) {
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const nextEmail = email.trim();
    if (!isValidEmail(nextEmail)) {
      setError('Enter your email to see your results.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ email: nextEmail, firstName: firstName.trim() });
    } catch {
      setError("We couldn't save your email. Check it and try again.");
      setSubmitting(false);
    }
  };

  return (
    <main data-screen-label="Results email">
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

      <form onSubmit={submit} noValidate>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="results-email" style={fieldLabel}>
            Email
          </label>
          <input
            id="results-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby="results-email-note"
            onChange={(event) => setEmail(event.target.value)}
            style={fieldInput}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="results-first-name" style={fieldLabel}>
            First name <span style={{ fontWeight: 400, color: '#6b7381' }}>(optional)</span>
          </label>
          <input
            id="results-first-name"
            name="given-name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            style={fieldInput}
          />
        </div>

        <p id="results-email-note" style={{ margin: '0 0 16px 0', fontSize: 15, lineHeight: 1.45, color: '#5b6472' }}>
          We'll email your results. No spam. Unsubscribe anytime.
        </p>

        {error ? (
          <p role="alert" style={{ margin: '0 0 12px 0', fontSize: 15, lineHeight: 1.45, color: '#9b2c2c' }}>
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
            background: '#2F5BEA',
            color: '#ffffff',
            fontSize: 21,
            fontWeight: 700,
            cursor: submitting ? 'wait' : 'pointer',
            opacity: submitting ? 0.75 : 1
          }}
        >
          {submitting ? 'Sending…' : 'See my results'}
        </button>
      </form>
    </main>
  );
}
