import React from 'react';
import { DENTIST_LINE, SHIPPING_LINE } from '../config.js';

const STEPS = [
  ['Impression kit', 'An impression kit is sent to you. Take as many mold tries as you need.'],
  ['Dentist review', DENTIST_LINE],
  ['U.S. lab', 'A U.S. lab makes the partial from the impressions the dentist reviewed.'],
  ['Shipping', SHIPPING_LINE]
];

export default function HowItWorks() {
  return (
    <section style={{ marginBottom: 26 }}>
      <h2 style={{ margin: '4px 0 16px 0', fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>How it works</h2>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map(([title, body], i) => (
          <li
            key={title}
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 2px 10px rgba(17,24,39,0.06)',
              padding: '16px 18px'
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#2F5BEA',
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {i + 1}
            </span>
            <span style={{ display: 'block' }}>
              <strong style={{ display: 'block', fontSize: 20, lineHeight: 1.3, color: '#111827', marginBottom: 4 }}>
                {title}
              </strong>
              <span style={{ display: 'block', fontSize: 18, lineHeight: 1.5, color: '#454e5c' }}>{body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
