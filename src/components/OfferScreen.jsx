import React, { useEffect, useState } from 'react';
import ImagePlaceholder from './ImagePlaceholder.jsx';
import { LINKS, money } from '../config.js';
import { checkoutBothArches, checkoutOneArch } from '../lib/checkout.js';
import {
  FAQ_COPY,
  INCLUDED_COPY,
  NEXT_HEADING,
  NEXT_STEPS,
  includedProductLine
} from '../lib/offerCopy.js';
import { activeChoice, offerForAnswers, purchaseLine } from '../lib/offerMatch.js';
import { setupScrollTracking, trackOfferPageViewed, trackSendKitClicked } from '../lib/track.js';

const MATCH_LINE = 'Based on your answers, Flex Partial may be a fit.';
const REVIEW_LINE =
  "A partner dentist licensed in your state reviews your photos and decides whether it's a fit. Placing your order starts that review.";
const HERO = ['16 / 9', 'PLACEHOLDER: Flex Partial with kit on plain background, 1:1, 1200px'];

const FILM = [
  ['1 / 1', 'PLACEHOLDER: Flex Partial three-quarter product shot on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: kit contents on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: partial case on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial detail product shot on plain background, 1:1, 1200px']
];

const ARCHES = [
  ['upper', INCLUDED_COPY.archUpper, 'PLACEHOLDER: upper partial product shot, 2:1, 600px'],
  ['lower', INCLUDED_COPY.archLower, 'PLACEHOLDER: lower partial product shot, 2:1, 600px'],
  ['both', INCLUDED_COPY.archBoth, 'PLACEHOLDER: both partials product shot, 2:1, 600px']
];

const PAYMENT_MARKS = [
  ['4 / 1', 'PLACEHOLDER: Apple Pay, 4:1, 200px'],
  ['200 / 47', 'PLACEHOLDER: Affirm, 200:47, 200px'],
  ['40 / 17', 'PLACEHOLDER: Visa, 40:17, 200px'],
  ['50 / 13', 'PLACEHOLDER: Mastercard, 50:13, 200px'],
  ['100 / 37', 'PLACEHOLDER: Debit, 100:37, 200px']
];

export default function OfferScreen({ answers, inPersonFirst }) {
  const initial = offerForAnswers(answers);
  const [arch, setArch] = useState(initial.arch);
  const [selected, setSelected] = useState(initial.selected);
  const offer = offerForAnswers({ arch });
  const active = activeChoice(offer, selected);

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
        <div className="offer-gallery">
          <div className="offer-hero">
            <ImagePlaceholder text={HERO[1]} ratio={HERO[0]} />
          </div>
          <div className="offer-film">
            {FILM.map(([ratio, text]) => (
              <ImagePlaceholder key={text} text={text} ratio={ratio} />
            ))}
          </div>
        </div>

        <div className="offer-buy">
          <h1 className="offer-title">{MATCH_LINE}</h1>
          <p className="offer-price" data-match-price>{money(offer.flex.price)}</p>
          <p className="offer-note">{REVIEW_LINE}</p>

          <div className="arch-row" role="group" aria-label="Arch">
            {ARCHES.map(([value, label, shot]) => {
              const choice = activeChoice(offerForAnswers({ arch: value }), selected);
              const on = arch === value;
              return (
                <button
                  key={value}
                  type="button"
                  className={on ? 'arch-card is-on' : 'arch-card'}
                  aria-pressed={on}
                  onClick={() => setArch(value)}
                >
                  <ImagePlaceholder text={shot} ratio="2 / 1" />
                  <span className="arch-label">{label}</span>
                  <span className="arch-price">{money(choice.price)}</span>
                </button>
              );
            })}
          </div>

          <div id="offer-cards" className="sku-row" role="group" aria-label="Partial choices">
            <button
              type="button"
              className={selected === 'flex' ? 'sku-card is-on' : 'sku-card'}
              aria-pressed={selected === 'flex'}
              onClick={() => setSelected('flex')}
            >
              <span className="sku-kicker">Your match.</span>
              <span className="sku-name">Flex Partial</span>
            </button>
            <button
              type="button"
              className={selected === 'precision' ? 'sku-card is-on' : 'sku-card'}
              aria-pressed={selected === 'precision'}
              onClick={() => setSelected('precision')}
            >
              <span className="sku-name">Precision Partial Pro</span>
              <span className="sku-price">{money(offer.precision.price)}</span>
            </button>
          </div>

          <p className="offer-selected" data-selected-offer>{purchaseLine(active)}</p>
          <a className="offer-checkout" data-checkout href={active.url} onClick={buy}>
            <span>Continue to checkout</span>
            <span>{money(active.price)}</span>
          </a>

          <div className="pay-panel">
            <div className="ph-pay">
              {PAYMENT_MARKS.map(([ratio, text]) => (
                <ImagePlaceholder key={text} text={text} ratio={ratio} />
              ))}
            </div>
          </div>

          {inPersonFirst && (
            <div className="offer-visit">
              <p>
                <strong>See a dentist in person first.</strong> Pain, swelling,
                a loose tooth, or bleeding needs an in-person visit before a partial is planned. A licensed
                dentist in your state can tell you what is going on.
              </p>
            </div>
          )}
        </div>
      </div>

      <section className="included" aria-label={INCLUDED_COPY.heading}>
        <h2>{INCLUDED_COPY.heading}</h2>
        <ul className="included-list">
          <li>{INCLUDED_COPY.dentist}</li>
          <li>{INCLUDED_COPY.kit}</li>
          <li>{INCLUDED_COPY.shipping}</li>
          <li data-included-product>{includedProductLine(active.name, offer.arch, money(active.price))}</li>
        </ul>
      </section>

      <section className="faq" aria-label="Details">
        {FAQ_COPY.map(([title, body]) => (
          <details key={title} className="faq-row">
            <summary>
              <span>{title}</span>
              <span className="faq-plus" aria-hidden="true">+</span>
            </summary>
            <p>{body}</p>
          </details>
        ))}
      </section>

      <section className="next" aria-label={NEXT_HEADING}>
        <h2>{NEXT_HEADING}</h2>
        <ol className="next-list">
          {NEXT_STEPS.map(([title, body, shot], index) => (
            <li key={title} className={index % 2 === 1 ? 'next-step is-flip' : 'next-step'}>
              <div className="next-copy">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <ImagePlaceholder text={shot} ratio="1 / 1" />
            </li>
          ))}
        </ol>
      </section>

      <p className="offer-contact">
        Questions?{' '}
        <a href={`mailto:${LINKS.email}`} className="offer-mail">{LINKS.email}</a>
      </p>
    </main>
  );
}
