import React from 'react';
import Check from './Check.jsx';

const ITEMS = [
  'Custom-made from your impression',
  'Removable — take it out, put it back',
  'Licensed dentist reviews your case before anything is made',
  'Built in a licensed U.S. lab · you pick shade'
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
