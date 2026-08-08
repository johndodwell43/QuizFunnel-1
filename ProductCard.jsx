import React from 'react';
import Check from './Check.jsx';
import ImageSlot from './ImageSlot.jsx';
import { LINKS } from '../config.js';

const INCLUDED = [
  'A licensed dentist reviews your case and plans your fit',
  'Your impression kit — with unlimited free tries',
  "Take it out. Pop it back in. Nothing glued. Nothing forever. You're in charge.",
  'Your partial, custom made in a licensed US lab',
  "Fit Assurance™ — if it doesn't feel right, we help make it right",
  'You pick your shade — choose your gum and tooth color during the process, so it matches your smile and looks natural',
  'Free 2-day UPS both ways, with tracking at every step'
];

const LAB_NOTE =
  'Once your approved impressions reach the licensed lab, your partial is built in about 10 business days. We keep you posted by text or email — your choice — and cover fast 2-day shipping every step, no questions asked.';

export default function ProductCard({
  dark = false,
  badge,
  photo,
  photoAlt,
  title,
  anchorPrice,
  price,
  priceNote,
  secondArchLine,
  supportLine,
  affirmLine,
  materials,
  allOfItLine,
  href,
  onCtaFocus
}) {
  const tick = dark ? '#8fb5ff' : '#2F5BEA';
  const muted = dark ? '#98a2b3' : '#6b7381';
  const body = dark ? '#c8d2e2' : '#454e5c';
  const border = dark ? 'rgba(255,255,255,0.16)' : '#e6eaf2';
  const link = dark ? '#8fb5ff' : '#2F5BEA';

  return (
    <div
      style={{
        flex: '1 1 260px',
        background: dark ? '#111827' : '#ffffff',
        color: dark ? '#ffffff' : '#111827',
        borderRadius: 20,
        boxShadow: dark ? '0 6px 18px rgba(17,24,39,0.25)' : '0 2px 10px rgba(17,24,39,0.07)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <span
        style={{
          alignSelf: 'flex-start',
          background: dark ? '#d7ecff' : '#2F5BEA',
          color: dark ? '#111827' : '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          padding: '5px 10px',
          borderRadius: 999
        }}
      >
        {badge}
      </span>

      <ImageSlot src={photo} alt={photoAlt} height={150} radius={14} />

      <h2 style={{ margin: 0, fontSize: 25, fontWeight: 700 }}>{title}</h2>

      <div>
        <p style={{ margin: '0 0 6px 0', fontSize: 16, color: muted, textDecoration: 'line-through' }}>
          {anchorPrice}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{price}</span>
          <span style={{ fontSize: 16, color: dark ? '#b9c2d2' : '#454e5c' }}>{priceNote}</span>
        </div>
        <div
          style={{
            marginTop: 10,
            background: dark ? 'rgba(215,236,255,0.12)' : '#f2f7ff',
            borderRadius: 12,
            padding: '10px 12px',
            fontSize: 16,
            lineHeight: 1.4,
            color: dark ? '#d7ecff' : '#1e3fa8',
            fontWeight: 700
          }}
        >
          {secondArchLine}
        </div>
        <div
          style={{
            fontSize: 16,
            color: dark ? '#ffffff' : '#454e5c',
            marginTop: 10,
            lineHeight: 1.45,
            fontWeight: dark ? 700 : 400
          }}
        >
          {supportLine}
        </div>
        <div style={{ fontSize: 16, color: dark ? '#b9c2d2' : '#454e5c', marginTop: 8, lineHeight: 1.45 }}>
          {affirmLine}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${border}`, paddingTop: 14 }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: 17, fontWeight: 700, color: dark ? '#ffffff' : '#111827' }}>
          Everything's included:
        </h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 16, lineHeight: 1.4, color: body }}>
          {INCLUDED.map((item) => (
            <li key={item} style={{ display: 'flex', gap: 8 }}>
              <Check stroke={tick} size={17} marginTop={2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 17, lineHeight: 1.45 }}>
        {materials.map(([lead, rest]) => (
          <li key={lead} style={{ display: 'flex', gap: 8 }}>
            <Check stroke={tick} size={18} marginTop={2} />
            <span>
              <strong>{lead}</strong> {rest}
            </span>
          </li>
        ))}
      </ul>

      <p style={{ margin: 0, fontSize: 16, color: muted }}>{allOfItLine}</p>

      <a
        href={href}
        onFocus={onCtaFocus}
        onMouseEnter={onCtaFocus}
        style={{
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 66,
          background: dark ? '#ffffff' : '#2F5BEA',
          color: dark ? '#111827' : '#ffffff',
          borderRadius: 16,
          fontSize: 21,
          fontWeight: 700,
          textDecoration: 'none'
        }}
      >
        Send My Kit →
      </a>

      <p style={{ margin: '10px 0 0 0', fontSize: 13, lineHeight: 1.45, color: muted }}>{LAB_NOTE}</p>
      <p style={{ margin: '8px 0 0 0', fontSize: 13, lineHeight: 1.45, color: muted }}>
        A licensed dentist reviews your case before anything is made. If they can't help you, you're
        refunded — see our{' '}
        <a href={LINKS.refund} style={{ color: link }}>
          Refund Policy
        </a>
        .
      </p>
    </div>
  );
}
