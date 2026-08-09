import React from 'react';
import { LINKS } from '../config.js';

const chromeButton = {
  width: 48,
  height: 48,
  background: 'rgba(255,255,255,0.7)',
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#111827'
};

export default function Header({ showBack, onBack, stepLabel }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '14px 0 10px 0'
      }}
    >
      {showBack ? (
        <button
          aria-label="Go back"
          onClick={onBack}
          style={{ ...chromeButton, border: 'none', cursor: 'pointer' }}
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
        <img src="/images/klyros-logo.png" alt="Klyros" style={{ height: 30, width: 'auto', display: 'block' }} />
        <div style={{ fontSize: 15, color: '#454e5c', whiteSpace: 'nowrap' }}>
          Find Your Fit · {stepLabel}
        </div>
      </div>

      <a aria-label="Exit quiz" href={LINKS.home} style={{ ...chromeButton, textDecoration: 'none' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </a>
    </header>
  );
}
