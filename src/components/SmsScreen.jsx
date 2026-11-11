import React, { useEffect, useId, useState } from 'react';
import { SMS_REWARD, money } from '../config.js';
import { phoneForLead } from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { scheduleLeadRetry } from '../lib/pendingLead.js';
import { isTaggedLink, markRewardEarned } from '../lib/reward.js';
import { trackSmsOptIn, trackSmsScreenViewed } from '../lib/track.js';

// Shown after the last question, right before the result.
// Visitors from our own tagged links get $50 off for texts; everyone else is offered case updates.
export const SMS_TERMS =
  'Optional. By tapping, you agree to get recurring automated marketing texts from Klyros Dental at this number. Consent is not a condition of purchase. Msg & data rates may apply. Msg frequency varies. Reply HELP for help, STOP to cancel.';

const UPDATES = [
  'When your impression kit ships',
  'When a dentist licensed in your state has reviewed your photos',
  'When your partial leaves the lab'
];

export default function SmsScreen({ lead, onDone }) {
  const phoneId = useId();
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const reward = isTaggedLink();
  const ready = phoneForLead(phone) !== '';
  const off = money(SMS_REWARD.amount);

  useEffect(() => {
    trackSmsScreenViewed(reward);
  }, [reward]);

  async function submit(event) {
    event.preventDefault();
    if (!ready || sending) return;
    setSending(true);
    const next = { ...lead, phone: phoneForLead(phone), smsConsent: true };
    trackSmsOptIn(reward);
    if (reward) markRewardEarned();
    try {
      await persistQuizLead(next);
    } catch {
      scheduleLeadRetry(next);
    }
    onDone(next);
  }

  return (
    <main className="sms-screen" data-screen-label="SMS">
      <div className="sms-card">
        <p className="sms-eyebrow">Your match is ready</p>
        <h1 className="sms-title">
          {reward ? (
            <>
              Take <span className="sms-off">{off} off</span> your partial.
            </>
          ) : (
            'Know where your case is, every step.'
          )}
        </h1>
        <p className="sms-sub">
          {reward
            ? `Add your number and we'll take ${off} off at checkout. Then we text you at the three moments that matter:`
            : "Add your number and we'll text you at the three moments that matter:"}
        </p>
        <ul className="sms-list">
          {UPDATES.map((line) => (
            <li key={line}>
              <span className="sms-check" aria-hidden="true">✓</span>
              {line}
            </li>
          ))}
        </ul>

        <form onSubmit={submit} noValidate>
          <label htmlFor={phoneId} className="sms-label">
            Phone
          </label>
          <div className="sms-phone">
            <span className="sms-flag" aria-hidden="true">
              🇺🇸 +1
            </span>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={24}
              placeholder="(555) 555-5555"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <button type="submit" className="email-gate-submit sms-submit" disabled={!ready || sending}>
            {sending ? 'Sending…' : reward ? `Text me my ${off} off` : 'Text me my updates'}
          </button>
          <p className="sms-terms">{SMS_TERMS}</p>
        </form>
      </div>
      <button type="button" className="sms-skip" onClick={() => onDone(null)}>
        No thanks, show my match
      </button>
    </main>
  );
}
