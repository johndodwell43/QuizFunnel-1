import React, { useEffect } from 'react';
import ProofBlock from './ProofBlock.jsx';
import ValueList from './ValueList.jsx';
import HowItWorks from './HowItWorks.jsx';
import Footer from './Footer.jsx';
import { AFFIRM_LINE, DENTIST_LINE, LINKS, PRICING, money } from '../config.js';
import { checkoutOneArch, checkoutBothArches } from '../lib/checkout.js';
import { trackSendKitClicked, trackOfferPageViewed, setupScrollTracking } from '../lib/track.js';

const primaryButton = {
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 64,
  width: '100%',
  border: 'none',
  background: '#2F5BEA',
  color: '#ffffff',
  borderRadius: 16,
  fontSize: 20,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  padding: '14px 18px'
};

const sectionTitle = {
  margin: '0 0 12px 0',
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.2,
  color: '#111827'
};

const body = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.5,
  color: '#454e5c'
};

function PriceFigures({ oneArch, both }) {
  const figure = { minWidth: 120 };
  const amount = { fontSize: 36, fontWeight: 700, lineHeight: 1.1, color: '#111827' };
  const label = { marginTop: 4, fontSize: 18, lineHeight: 1.3, color: '#454e5c' };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 28px', marginTop: 14 }}>
      <div style={figure}>
        <div style={amount}>{oneArch}</div>
        <div style={label}>one arch</div>
      </div>
      <div style={figure}>
        <div style={amount}>{both}</div>
        <div style={label}>both arches</div>
      </div>
    </div>
  );
}

export default function OfferScreen({ answers, inPersonFirst }) {
  useEffect(() => {
    trackOfferPageViewed();
    setupScrollTracking();
  }, []);

  const isBoth = answers.arch === 'both';
  const archLabel = isBoth ? 'both arches' : 'one arch';

  const flexPay = isBoth ? PRICING.flexBoth : PRICING.flexPrice;
  const precisionPay = isBoth ? PRICING.precisionBoth : PRICING.precisionPrice;

  const buy = (sku, amount) => {
    const arch = isBoth ? 'both' : answers.arch || 'upper';
    const tracking = trackSendKitClicked(sku, arch, amount);
    if (isBoth) checkoutBothArches(sku, tracking);
    else checkoutOneArch(sku, arch, tracking);
  };

  return (
    <main data-screen-label="Offer">
      <h1
        style={{
          fontSize: 'clamp(30px, 5vw, 40px)',
          lineHeight: 1.15,
          fontWeight: 700,
          margin: '0 0 12px 0',
          textWrap: 'pretty',
          color: '#111827'
        }}
      >
        Partial prices, before checkout.
      </h1>
      <p style={{ ...body, marginBottom: 22 }}>
        Flex Partial and Precision Partial Pro. The price depends on one arch or both. {DENTIST_LINE}
      </p>

      <section id="offer-cards" aria-label="Prices" style={{ marginBottom: 26 }}>
        <article
          style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
            padding: '20px 20px 18px',
            marginBottom: 14
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>Flex Partial</h2>
          <p style={{ ...body, marginTop: 8 }}>Removable partial. One arch, or both arches.</p>
          <PriceFigures oneArch={money(PRICING.flexPrice)} both={money(PRICING.flexBoth)} />
        </article>

        <article
          style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
            padding: '20px 20px 18px'
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>Precision Partial Pro</h2>
          <p style={{ ...body, marginTop: 8 }}>Removable partial. One arch, or both arches.</p>
          <PriceFigures oneArch={money(PRICING.precisionPrice)} both={money(PRICING.precisionBoth)} />
        </article>

        <p style={{ ...body, marginTop: 14, fontWeight: 700, color: '#111827' }}>{AFFIRM_LINE}</p>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={sectionTitle}>What these are</h2>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
            padding: '20px 22px'
          }}
        >
          <p style={body}>
            Flex Partial and Precision Partial Pro are removable partials, custom made from your
            impressions in a U.S. lab. {DENTIST_LINE}
          </p>
          <p style={{ ...body, marginTop: 12 }}>
            Flex Partial uses a Valplast gum base and acrylic resin teeth. Precision Partial Pro uses
            a Duraflex gum base and PMMA teeth, finished by hand in the lab.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={sectionTitle}>Why this path</h2>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
            padding: '20px 22px'
          }}
        >
          <p style={body}>
            A partial replaces missing teeth and comes out. It is made from impressions after a
            licensed dentist reviews the case. This page is not a diagnosis.
          </p>
        </div>
        {inPersonFirst && (
          <div
            style={{
              background: '#fdf3d1',
              borderRadius: 16,
              padding: '16px 18px',
              marginTop: 14,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start'
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8a6d1a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 2 }}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: '#6b5410' }}>
              <strong style={{ color: '#55430c' }}>See a dentist in person first.</strong> Pain, swelling,
              a loose tooth, or bleeding needs an in-person visit before a partial is planned. A licensed
              dentist in your state can tell you what is going on.
            </p>
          </div>
        )}
      </section>

      <ProofBlock />
      <HowItWorks />
      <ValueList />

      <section aria-label="Checkout" style={{ marginBottom: 8 }}>
        <h2 style={sectionTitle}>Checkout</h2>
        <p style={{ ...body, marginBottom: 14 }}>
          Your answers selected {archLabel}. Each button uses that choice.
        </p>

        <article
          style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
            padding: '20px',
            marginBottom: 14
          }}
        >
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Flex Partial</h3>
          <p style={{ ...body, marginTop: 8 }}>
            {money(flexPay)} · {archLabel}
          </p>
          <button type="button" onClick={() => buy('flex', flexPay)} style={primaryButton}>
            Continue to checkout
          </button>
        </article>

        <article
          style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
            padding: '20px'
          }}
        >
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Precision Partial Pro</h3>
          <p style={{ ...body, marginTop: 8 }}>
            {money(precisionPay)} · {archLabel}
          </p>
          <button type="button" onClick={() => buy('precision', precisionPay)} style={primaryButton}>
            Continue to checkout
          </button>
        </article>

        <p style={{ ...body, marginTop: 18, textAlign: 'center' }}>
          Questions?{' '}
          <a
            href={`mailto:${LINKS.email}`}
            style={{
              color: '#2F5BEA',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 48
            }}
          >
            {LINKS.email}
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
