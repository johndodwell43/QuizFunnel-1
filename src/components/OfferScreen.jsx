import React, { useEffect, useState } from 'react';
import Footer from './Footer.jsx';
import HowItWorks from './HowItWorks.jsx';
import ImagePlaceholder from './ImagePlaceholder.jsx';
import ValueList from './ValueList.jsx';
import { AFFIRM_LINE, LINKS, money } from '../config.js';
import { checkoutBothArches, checkoutOneArch } from '../lib/checkout.js';
import { activeChoice, offerForAnswers, purchaseLine } from '../lib/offerMatch.js';
import { setupScrollTracking, trackOfferPageViewed, trackSendKitClicked } from '../lib/track.js';

const MATCH_LINE = 'Based on your answers, Flex Partial may be a fit.';
const REVIEW_LINE =
  "A partner dentist licensed in your state reviews your photos and decides whether it's a fit. Placing your order starts that review.";

const GALLERY = [
  ['1 / 1', 'PLACEHOLDER: Flex Partial with kit on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial product video still on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial three-quarter product shot on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial side product shot on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial detail product shot on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: kit contents on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: partial case on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial back product shot on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial close product shot on plain background, 1:1, 1200px']
];

const OPTION_SHOTS = [
  ['2 / 1', 'PLACEHOLDER: both-arch partial product shot on plain background, 2:1, 1200px'],
  ['2 / 1', 'PLACEHOLDER: upper partial product shot on plain background, 2:1, 1200px'],
  ['2 / 1', 'PLACEHOLDER: lower partial product shot on plain background, 2:1, 1200px'],
  ['2 / 1', 'PLACEHOLDER: Flex Partial front product shot on plain background, 2:1, 1200px'],
  ['2 / 1', 'PLACEHOLDER: Flex Partial angled product shot on plain background, 2:1, 1200px'],
  ['2 / 1', 'PLACEHOLDER: Precision Partial Pro angled product shot on plain background, 2:1, 1200px']
];

const PAYMENT_MARKS = [
  ['4 / 1', 'PLACEHOLDER: Apple Pay, 4:1, 200px'],
  ['200 / 47', 'PLACEHOLDER: Affirm, 200:47, 200px'],
  ['40 / 17', 'PLACEHOLDER: Visa, 40:17, 200px'],
  ['50 / 13', 'PLACEHOLDER: Mastercard, 50:13, 200px'],
  ['100 / 37', 'PLACEHOLDER: Debit, 100:37, 200px']
];

const KIT_SHOTS = [
  'PLACEHOLDER: kit on plain background, 1:1, 800px',
  'PLACEHOLDER: partial carrying case on plain background, 1:1, 800px',
  'PLACEHOLDER: kit accessory on plain background, 1:1, 800px',
  'PLACEHOLDER: second kit accessory on plain background, 1:1, 800px'
];

const STEP_SHOTS = [
  'PLACEHOLDER: kit product shot on plain background, 6:7, 1200px',
  'PLACEHOLDER: packed kit on plain background, 6:7, 1200px',
  'PLACEHOLDER: finished partial on plain background, 6:7, 1200px'
];

const PRODUCT_SQUARES = [
  'PLACEHOLDER: Flex Partial product shot on plain background, 1:1, 800px',
  'PLACEHOLDER: Flex Partial second product shot on plain background, 1:1, 800px',
  'PLACEHOLDER: Precision Partial Pro product shot on plain background, 1:1, 800px',
  'PLACEHOLDER: Precision Partial Pro second product shot on plain background, 1:1, 800px'
];

export default function OfferScreen({ answers, inPersonFirst }) {
  const offer = offerForAnswers(answers);
  const [selected, setSelected] = useState(offer.selected);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const active = activeChoice(offer, selected);
  const flexGallery = GALLERY[0];

  useEffect(() => {
    trackOfferPageViewed();
    setupScrollTracking();
  }, []);

  const buy = (event) => {
    event.preventDefault();
    const tracking = trackSendKitClicked(active.sku, offer.arch, active.price);
    if (offer.arch === 'both') checkoutBothArches(active.sku, tracking);
    else checkoutOneArch(active.sku, offer.arch, tracking);
  };

  return (
    <main data-screen-label="Offer" data-arch={offer.arch} className="offer-screen">
      <div className="offer-top">
        <div className="offer-hero">
          <ImagePlaceholder text={flexGallery[1]} ratio={flexGallery[0]} />
        </div>
        <div className="offer-gallery-rest">
          <div className="offer-thumbs">
            {GALLERY.map(([ratio, text], index) => (
              <button
                key={text}
                type="button"
                className="offer-thumb"
                aria-label={`Show gallery image ${index + 1}`}
                aria-current={index === galleryIndex}
                onClick={() => setGalleryIndex(index)}
              >
                <ImagePlaceholder text={text} ratio={ratio} />
              </button>
            ))}
          </div>
          <div className="ph-grid ph-grid-3">
            {OPTION_SHOTS.map(([ratio, text]) => (
              <ImagePlaceholder key={text} text={text} ratio={ratio} />
            ))}
          </div>
          <ImagePlaceholder
            text="PLACEHOLDER: Flex Partial product mark on plain background, 1:1, 240px"
            ratio="1 / 1"
          />
        </div>

        <div className="offer-buy">
          <h1 className="offer-title">{MATCH_LINE}</h1>
          <p className="offer-price" data-match-price>{money(offer.flex.price)}</p>
          <p className="offer-note">{REVIEW_LINE}</p>

          <div id="offer-cards" className="offer-cards" role="group" aria-label="Partial choices">
            <button
              type="button"
              className={`offer-card is-match${selected === 'flex' ? ' is-selected' : ''}`}
              aria-pressed={selected === 'flex'}
              onClick={() => setSelected('flex')}
            >
              <ImagePlaceholder
                text="PLACEHOLDER: Flex Partial product shot on plain background, 2:1, 1200px"
                ratio="2 / 1"
              />
              <span className="offer-card-copy">
                <span className="offer-kicker">Your match.</span>
                <span className="offer-card-name">Flex Partial</span>
                <span className="offer-card-price" data-card-price>{money(offer.flex.price)}</span>
              </span>
            </button>

            <button
              type="button"
              className={`offer-card${selected === 'precision' ? ' is-selected' : ''}`}
              aria-pressed={selected === 'precision'}
              onClick={() => setSelected('precision')}
            >
              <ImagePlaceholder
                text="PLACEHOLDER: Precision Partial Pro product shot on plain background, 2:1, 1200px"
                ratio="2 / 1"
              />
              <span className="offer-card-copy">
                <span className="offer-card-name">Precision Partial Pro</span>
                <span className="offer-card-price">{money(offer.precision.price)}</span>
              </span>
            </button>
          </div>

          <p className="offer-selected" data-selected-offer>{purchaseLine(active)}</p>
          <a className="offer-checkout" data-checkout href={active.url} onClick={buy}>
            Continue to checkout
          </a>
          <p className="offer-affirm">{AFFIRM_LINE}</p>

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

          <div className="ph-pay">
            {PAYMENT_MARKS.map(([ratio, text]) => (
              <ImagePlaceholder key={text} text={text} ratio={ratio} />
            ))}
          </div>
        </div>
      </div>

      <div className="ph-grid ph-grid-4">
        {KIT_SHOTS.map((text) => (
          <ImagePlaceholder key={text} text={text} ratio="1 / 1" />
        ))}
      </div>

      <div className="ph-grid ph-grid-3 offer-steps">
        {STEP_SHOTS.map((text) => (
          <ImagePlaceholder key={text} text={text} ratio="980 / 1145" />
        ))}
      </div>
      <div className="offer-step-icon">
        <ImagePlaceholder
          text="PLACEHOLDER: kit icon on plain background, 1:1, 500px"
          ratio="1 / 1"
        />
      </div>
      <HowItWorks />

      <div className="ph-grid ph-grid-4">
        {PRODUCT_SQUARES.map((text) => (
          <ImagePlaceholder key={text} text={text} ratio="1 / 1" />
        ))}
      </div>
      <div className="offer-badge">
        <ImagePlaceholder
          text="PLACEHOLDER: Flex Partial product shot on plain background, 1:1, 1040px"
          ratio="1 / 1"
        />
      </div>

      <ValueList />

      <p className="offer-contact">
        Questions?{' '}
        <a href={`mailto:${LINKS.email}`} className="offer-mail">
          {LINKS.email}
        </a>
      </p>

      <Footer />
    </main>
  );
}
