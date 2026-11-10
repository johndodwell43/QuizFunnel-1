import React, { useEffect, useRef, useState } from 'react';
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
import {
  activeChoice,
  archOptions,
  offerForAnswers,
  partialImage,
  purchaseLine,
  teethCount
} from '../lib/offerMatch.js';
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

const ARCH_ROW = {
  both: ['Both arches', 'Upper + lower'],
  upper: ['Upper', 'Top arch'],
  lower: ['Lower', 'Bottom arch']
};

const PAYMENT_MARKS = [
  ['4 / 1', 'PLACEHOLDER: Apple Pay, 4:1, 200px'],
  ['200 / 47', 'PLACEHOLDER: Affirm, 200:47, 200px'],
  ['40 / 17', 'PLACEHOLDER: Visa, 40:17, 200px'],
  ['50 / 13', 'PLACEHOLDER: Mastercard, 50:13, 200px'],
  ['100 / 37', 'PLACEHOLDER: Debit, 100:37, 200px']
];

function PartialPhoto({ arch, teeth }) {
  const src = partialImage(arch, teeth);
  const [failed, setFailed] = useState(false);
  const n = teethCount(teeth);
  const label = `${arch === 'lower' ? 'Lower' : 'Upper'} partial · ${n === 6 ? '6+' : n} ${n === 1 ? 'tooth' : 'teeth'}`;
  return (
    <figure className="rec-shot">
      <div className="rec-photo">
        {failed ? (
          <ImagePlaceholder text={`PLACEHOLDER: ${src.replace('/images/partials/', '')}, 3:2, 1200px`} ratio="3 / 2" />
        ) : (
          <img src={src} alt={label} width="1200" height="800" onError={() => setFailed(true)} />
        )}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

// Amazon-style gallery for the /shop page: big photo, thumbnails underneath.
// First slide(s) are the partial for the chosen arch + tooth count, then the product shots.
function Thumb({ slide, teeth }) {
  const [failed, setFailed] = useState(false);
  if (slide.kind === 'partial') {
    const src = partialImage(slide.arch, teeth);
    return failed ? (
      <span className="thumb-ph">{slide.arch === 'lower' ? 'Lower' : 'Upper'}</span>
    ) : (
      <img src={src} alt="" onError={() => setFailed(true)} />
    );
  }
  return <span className="thumb-ph">{slide.short}</span>;
}

function ProductGallery({ arch, teeth }) {
  const slides = [
    ...(arch === 'both' ? ['upper', 'lower'] : [arch]).map((a) => ({ kind: 'partial', arch: a, key: `p-${a}` })),
    ...FILM.map(([ratio, text], i) => ({ kind: 'ph', text, ratio, short: ['Angle', 'Kit', 'Case', 'Detail'][i], key: `f-${i}` }))
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [arch, teeth]);
  const current = slides[Math.min(index, slides.length - 1)];
  return (
    <div className="pg">
      <div className="pg-main">
        {current.kind === 'partial' ? (
          <PartialPhoto key={`${current.arch}-${teeth}`} arch={current.arch} teeth={teeth} />
        ) : (
          <div className="rec-photo">
            <ImagePlaceholder text={current.text} ratio="3 / 2" />
          </div>
        )}
      </div>
      <div className="pg-thumbs" role="tablist" aria-label="Product photos">
        {slides.map((slide, i) => (
          <button
            key={slide.key + teeth}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1}`}
            className={i === index ? 'pg-thumb is-on' : 'pg-thumb'}
            onClick={() => setIndex(i)}
          >
            <Thumb slide={slide} teeth={teeth} />
          </button>
        ))}
      </div>
    </div>
  );
}

const TEETH = ['1', '2', '3', '4', '5', '6+'];
const DIRECT_ARCHES = ['upper', 'lower', 'both'];
const SCREEN_LINES = [
  'No tooth removed in the last 90 days',
  'No tooth pain or swelling',
  'No loose or shifting teeth'
];

// direct: visitor came straight from the website (no quiz), so they pick arch and teeth here.
export default function OfferScreen({ answers = {}, inPersonFirst = false, direct = false }) {
  const initial = offerForAnswers(answers);
  const arches = direct ? DIRECT_ARCHES : archOptions(answers.arch);
  const [teeth, setTeeth] = useState(answers.teeth || '1');
  const [arch, setArch] = useState(initial.arch);
  const [selected, setSelected] = useState(initial.selected);
  const [details, setDetails] = useState(false);
  const detailsRef = useRef(null);
  const howRef = useRef(null);
  const offer = offerForAnswers({ arch });
  const active = activeChoice(offer, selected);
  const shots = arch === 'both' ? ['upper', 'lower'] : [arch];

  useEffect(() => {
    trackOfferPageViewed();
    setupScrollTracking();
  }, []);

  const openDetails = (target) => {
    setDetails(true);
    requestAnimationFrame(() => {
      const el = (target === 'how' ? howRef : detailsRef).current;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const buy = (event) => {
    event.preventDefault();
    const tracking = trackSendKitClicked(active.sku, offer.arch, active.price);
    if (offer.arch === 'both') checkoutBothArches(active.sku, tracking);
    else checkoutOneArch(active.sku, offer.arch, tracking);
  };

  return (
    <main data-screen-label="Offer" data-arch={offer.arch} className={inPersonFirst ? 'offer-screen has-visit' : 'offer-screen'}>
      <div className="offer-top rec">
        {direct ? (
          <ProductGallery arch={arch} teeth={teeth} />
        ) : (
          <div className={shots.length > 1 ? 'rec-shots is-both' : 'rec-shots'}>
            {shots.map((a) => (
              <PartialPhoto key={a} arch={a} teeth={teeth} />
            ))}
          </div>
        )}

        <div className="offer-buy">
          <h1 className="offer-title">{direct ? active.name : MATCH_LINE}</h1>
          {direct ? (
            <p className="offer-price" data-shop-price>{money(active.price)}</p>
          ) : (
            <p className="offer-price" data-match-price>{money(offer.flex.price)}</p>
          )}
          <p className="offer-note">{REVIEW_LINE}</p>

          {direct && (
            <>
              <p className="pick-label">Select arch</p>
              <div className="pick-row" role="group" aria-label="Arch">
                {[['upper', 'Upper teeth'], ['lower', 'Lower teeth'], ['both', 'Both']].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={arch === value ? 'pick-btn is-on' : 'pick-btn'}
                    aria-pressed={arch === value}
                    onClick={() => setArch(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {!direct && arches.length > 1 && (
            <>
              <p className="opt-label">Your arches</p>
              <div className="plan-list" role="group" aria-label="Arch">
                {arches.map((value, index) => {
                  const choice = activeChoice(offerForAnswers({ arch: value }), selected);
                  const on = arch === value;
                  const [name, sub] = ARCH_ROW[value];
                  return (
                    <React.Fragment key={value}>
                      {index === 1 && <p className="plan-split">Or start with one arch</p>}
                      <button
                        type="button"
                        className={on ? 'plan-row is-on' : 'plan-row'}
                        aria-pressed={on}
                        onClick={() => setArch(value)}
                      >
                        <span className="plan-name">
                          {name}
                          <span className="plan-sub">{sub}</span>
                        </span>
                        <span className="plan-price">{money(choice.price)}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          )}

          {direct && (
            <>
              <p className="pick-label">How many teeth to replace{arch === 'both' ? ' on each arch' : ''}?</p>
              <div className="teeth-row" role="group" aria-label="Teeth">
                {TEETH.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={teeth === n ? 'teeth-tile is-on' : 'teeth-tile'}
                    aria-pressed={teeth === n}
                    aria-label={`${n} ${n === '1' ? 'tooth' : 'teeth'}`}
                    onClick={() => setTeeth(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </>
          )}

          <p className={direct ? 'pick-label' : 'opt-label'}>Choose your partial</p>
          <div id="offer-cards" className="plan-list" role="group" aria-label="Partial choices">
            <button
              type="button"
              className={selected === 'flex' ? 'plan-row is-on' : 'plan-row'}
              aria-pressed={selected === 'flex'}
              onClick={() => setSelected('flex')}
            >
              <span className="plan-name">
                Flex Partial
                <span className="plan-sub">{direct ? 'Standard' : 'Your match'}</span>
              </span>
              <span className="plan-price">{money(offer.flex.price)}</span>
            </button>
            <button
              type="button"
              className={selected === 'precision' ? 'plan-row is-on' : 'plan-row'}
              aria-pressed={selected === 'precision'}
              onClick={() => setSelected('precision')}
            >
              <span className="plan-name">
                Precision Partial Pro
                <span className="plan-sub">Milled upgrade</span>
              </span>
              <span className="plan-price">{money(offer.precision.price)}</span>
            </button>
          </div>

          {direct && (
            <div className="screen-check">
              <p className="screen-check-title">Before you order</p>
              <ul>
                {SCREEN_LINES.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="screen-check-note">If any of these apply, see a dentist in person first.</p>
            </div>
          )}

          {inPersonFirst && (
            <div className="offer-visit">
              <p>
                <strong>See a dentist in person first.</strong> Pain, swelling,
                a loose tooth, or bleeding needs an in-person visit before a partial is planned. A licensed
                dentist in your state can tell you what is going on.
              </p>
            </div>
          )}

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

          <div className="details-links">
            <button type="button" className="details-link" onClick={() => openDetails('details')}>
              <span>See product details</span>
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="details-link" onClick={() => openDetails('how')}>
              <span>How it works</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="offer-details" ref={detailsRef} hidden={!details}>
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

        <section className="next" aria-label={NEXT_HEADING} ref={howRef}>
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
      </div>

      <p className="offer-contact">
        Questions?{' '}
        <a href={`mailto:${LINKS.email}`} className="offer-mail">{LINKS.email}</a>
      </p>
    </main>
  );
}
