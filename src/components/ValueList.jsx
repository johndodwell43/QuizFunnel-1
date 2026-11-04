import React from 'react';
import Check from './Check.jsx';
import { DENTIST_LINE, SHIPPING_LINE } from '../config.js';

const ITEMS = [
  'Impression kit',
  SHIPPING_LINE,
  DENTIST_LINE,
  'Made in a U.S. lab'
];

export default function ValueList() {
  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
        padding: '20px 22px',
        marginBottom: 26
      }}
    >
      <h2 style={{ margin: '0 0 14px 0', fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Included</h2>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          fontSize: 18,
          lineHeight: 1.45,
          color: '#454e5c'
        }}
      >
        {ITEMS.map((item) => (
          <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
