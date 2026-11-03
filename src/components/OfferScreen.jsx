import React, { useEffect } from 'react';
import ValueList from './ValueList.jsx';
import HowItWorks from './HowItWorks.jsx';
import ProductCard from './ProductCard.jsx';
import Footer from './Footer.jsx';
import { PRICING, money } from '../config.js';
import { checkoutOneArch, checkoutBothArches } from '../lib/checkout.js';
import { trackSendKitClicked, trackOfferPageViewed, setupScrollTracking } from '../lib/track.js';

const STEP6_TITLE = 'Quick case check · Step 6 of 6';

function Seal() {
  const square = {
    position: 'absolute',
    inset: 6,
    background: '#2F5BEA',
    borderRadius: '26%'
  };
  return (
    <div style={{ position: 'relative', width: 72, height: 72, marginBottom: 18 }}>
      <div style={{ ...square, animation: 'seal-spin-b 36s linear infinite' }} />
      <div style={{ ...square, transform: 'rotate(45deg)', animation: 'seal-spin 36s linear infinite' }} />
      <div style={{ ...square, background: '#111827', transform: 'rotate(22.5deg)', zIndex: -1, opacity: 0.12 }} />
      <svg
        style={{ position: 'absolute', inset: 0, margin: 'auto', animation: 'sparkle-breathe 3.2s ease-in-out infinite' }}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="#ffffff"
      >
        <path d="M12 2c.6 4.6 2.2 6.9 3.4 8 1.2 1.1 3.4 1.7 6.6 2-3.2.3-5.4.9-6.6 2-1.2 1.1-2.8 3.4-3.4 8-.6-4.6-2.2-6.9-3.4-8-1.2-1.1-3.4-1.7-6.6-2 3.2-.3 5.4-.9 6.6-2 1.2-1.1 2.8-3.4 3.4-8z" />
        <circle cx="19" cy="4.5" r="1.6" />
      </svg>
    </div>
  );
}

export default function OfferScreen({ answers, flagged }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = STEP6_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta ? meta.getAttribute('content') : null;
    if (meta) {
      meta.setAttribute(
        'content',
        `A licensed dentist reviews your case. A U.S. lab builds it. It ships to your door. Flex Partial™ from ${money(PRICING.flexPrice)}.`
      );
    }
    trackOfferPageViewed();
    setupScrollTracking();
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) meta.setAttribute('content', previousDescription);
    };
  }, []);

  useEffect(() => {
    console.log(
      '[OfferScreen] answers.arch =', answers.arch,
      '| isBoth =', answers.arch === 'both',
      '| Flex price =', money(answers.arch === 'both' ? PRICING.flexPrice + PRICING.flexSecondArch : PRICING.flexPrice),
      '| Precision price =', money(answers.arch === 'both' ? PRICING.precisionPrice + PRICING.precisionSecondArch : PRICING.precisionPrice)
    );
  }, [answers.arch]);

  const step1Answer = answers.arch || '';
  const isBoth = step1Answer === 'both';

  const flexBothTotal = PRICING.flexPrice + PRICING.flexSecondArch;
  const precisionBothTotal = PRICING.precisionPrice + PRICING.precisionSecondArch;

  const flexAmount = isBoth ? flexBothTotal : PRICING.flexPrice;
  const precisionAmount = isBoth ? precisionBothTotal : PRICING.precisionPrice;

  const flexPrice = money(flexAmount);
  const proPrice = money(precisionAmount);
  const flexFromPrice = money(PRICING.flexPrice);
  const priceNote = isBoth ? 'for both arches (upper and lower)' : 'for one arch (upper or lower)';

  const sendFlexKit = () => checkoutOneArch('flex', step1Answer, trackSendKitClicked('flex', step1Answer, flexAmount));

  return (
    <main data-screen-label="Offer">
      <Seal />

      <h1 style={{ fontSize: 'clamp(34px, 5.5vw, 44px)', lineHeight: 1.15, fontWeight: 700, margin: '0 0 12px 0', textWrap: 'pretty' }}>
        A custom partial planned with a licensed dentist.
      </h1>

      <p style={{ fontSize: 'clamp(18px, 3vw, 21px)', lineHeight: 1.55, color: '#454e5c', margin: '0 0 18px 0' }}>
        A licensed dentist reviews your case. A U.S. lab builds it. It ships to your door. Flex Partial™ from {flexFromPrice}.
      </p>

      <button
        type="button"
        id="offer-primary-cta"
        onClick={sendFlexKit}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 66,
          width: '100%',
          border: 'none',
          background: '#2F5BEA',
          color: '#ffffff',
          borderRadius: 16,
          fontSize: 21,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: 'pointer',
          margin: '0 0 22px 0'
        }}
      >
        Send My Kit →
      </button>

      <ValueList />

      {flagged && (
        <div style={{ background: '#fdf3d1', borderRadius: 16, padding: '16px 18px', marginBottom: 22, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a6d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: '#6b5410' }}>
            <strong style={{ color: '#55430c' }}>Your case gets extra attention.</strong> One of your
            answers means a licensed dentist in our network will take a closer look before we make anything. That's normal
            — and it won't slow down your order.
          </p>
        </div>
      )}

      <HowItWorks />

      <div id="offer-cards" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16 }}>
        <ProductCard
          badge="MOST POPULAR"
          photo="/images/lightcomp.png"
          photoAlt="Flexible Partial photo"
          title="Flexible Partial"
          anchorPrice="A dentist's office: $1,500–$4,000"
          price={flexPrice}
          priceNote={priceNote}
          secondArchLine={`Add your second arch for just ${money(PRICING.flexSecondArch)} — both arches ${money(
            flexBothTotal
          )}`}
          supportLine="This one price covers it all: the dentist's review, your kit, and a partial made just for you."
          affirmLine={`or ${PRICING.flexMonthly}`}
          materials={[
            ['Valplast gum base', '— light and flexible'],
            ['Acrylic resin teeth', '— look like real teeth']
          ]}
          allOfItLine={`All of it, for ${flexPrice}.`}
          onCta={sendFlexKit}
          onSecondArch={() => checkoutBothArches('flex', trackSendKitClicked('flex', 'both', flexBothTotal))}
        />

        <ProductCard
          dark
          badge="BEST LONG-TERM VALUE"
          photo="/images/darkcomp.png"
          photoAlt="Precision Partial Pro photo"
          title="Precision Partial Pro™"
          anchorPrice="A dentist's office: $2,000–$4,000"
          price={proPrice}
          priceNote={priceNote}
          secondArchLine={`Add your second arch for just ${money(PRICING.precisionSecondArch)} — both arches ${money(
            precisionBothTotal
          )}`}
          supportLine="Built even tougher. Made from a stronger material that stands up to daily wear — so it lasts even longer and you replace it less often. Buy once, and mostly forget about it."
          affirmLine={`or ${PRICING.precisionMonthly}`}
          materials={[
            ['Duraflex gum base', '— stays snug for years'],
            ['Premium PMMA teeth', '— keep their shape and color for years'],
            ['Finished by hand', 'by dental experts']
          ]}
          allOfItLine={`All of it, for ${proPrice}.`}
          onCta={() => checkoutOneArch('precision', step1Answer, trackSendKitClicked('precision', step1Answer, precisionAmount))}
          onSecondArch={() => checkoutBothArches('precision', trackSendKitClicked('precision', 'both', precisionBothTotal))}
        />
      </div>

      <Footer />
    </main>
  );
}
