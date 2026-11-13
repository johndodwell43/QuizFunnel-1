import React from 'react';
import { LINKS } from '../config.js';

const chromeButton = {
  width: 48,
  height: 48,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function Header({ showBack, onBack, stepLabel, gate = false, offer = false, showExit = true, plain = false }) {
  const ink = gate || offer ? '#0a1628' : '#111827';
  const muted = offer ? '#0a1628' : gate ? 'rgba(10, 22, 40, 0.62)' : '#454e5c';
  const chip = gate ? '#cfe9ff' : offer ? '#eef5ff' : 'rgba(255,255,255,0.7)';
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: gate ? '6px 0 4px 0' : offer ? 'calc(env(safe-area-inset-top, 0px) + 30px) 0 4px 0' : '14px 0 10px 0'
      }}
    >
      {showBack ? (
        <button
          aria-label="Go back"
          onClick={onBack}
          style={{ ...chromeButton, background: chip, color: ink, border: 'none', cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 48, height: 48 }} />
      )}

      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minWidth: 0
        }}
      >
        <a href={LINKS.home} aria-label="Klyros home" style={{ display: 'block', lineHeight: 0 }}>
          <img src="/images/klyros-logo.png" alt="Klyros" style={{ height: offer ? 38 : 30, width: 'auto', display: 'block' }} />
        </a>
        {!gate && !plain && (
          <div style={{ fontSize: 18, color: muted, lineHeight: 1.3 }}>
            Find Your Fit{stepLabel ? ` · ${stepLabel}` : ''}
          </div>
        )}
      </div>

      {showExit ? (
      <a aria-label="Exit quiz" href={LINKS.home} style={{ ...chromeButton, background: chip, color: ink, textDecoration: 'none' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </a>
      ) : (
        <div style={{ width: 48, height: 48 }} />
      )}
    </header>
  );
}
