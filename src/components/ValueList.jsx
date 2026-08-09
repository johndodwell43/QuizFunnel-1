import React from 'react';
import Check from './Check.jsx';

const ITEMS = [
  'Your partial is custom made to match your mouth',
  "Take it out. Pop it back in. Nothing glued. Nothing forever. You're in charge.",
  'A licensed dentist reviews your case and plans your fit',
  'Made in the USA by dental lab pros — in a licensed lab',
  'As many tries on your mold as you want, free — with a guide, an app, and real help',
  'You pick your shade — choose your gum and tooth color, so it matches your smile',
  "Fit Assurance™ — if it doesn't feel right, we help make it right",
  'Free 2-day UPS both ways — with tracking and updates at every step'
];

export default function ValueList() {
  return (
    <div style={{ background: '#ffffff', borderRadius: 20, boxShadow: '0 2px 10px rgba(17,24,39,0.07)', padding: '20px 22px', marginBottom: 26 }}>
      <h2 style={{ margin: '0 0 14px 0', fontSize: 21, fontWeight: 700 }}>
        Here's what you get — every time:
      </h2>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, fontSize: 17, lineHeight: 1.45, color: '#454e5c' }}>
        {ITEMS.map((item) => (
          <li key={item} style={{ display: 'flex', gap: 10 }}>
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
