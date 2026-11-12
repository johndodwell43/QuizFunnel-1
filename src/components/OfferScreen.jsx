import React, { useEffect, useRef, useState } from 'react';
import ImagePlaceholder from './ImagePlaceholder.jsx';
import { AFFIRM_LINE, DENTIST_LINE, LINKS, SMS_REWARD, money } from '../config.js';
import { rewardEarned, rewardParams } from '../lib/reward.js';
import { checkoutBothArches, checkoutOneArch } from '../lib/checkout.js';
import {
  FAQ_COPY,
  INCLUDED_COPY,
  NEXT_HEADING,
  NEXT_STEPS,
  ORDER_STEPS,
  QUIZ_FAQ,
  includedProductLine
} from '../lib/offerCopy.js';
import {
  activeChoice,
  archOptions,
  offerForAnswers,
  partialImage,
  purchaseLine,
  teethCount,
  toothAttributes
} from '../lib/offerMatch.js';
import { setupScrollTracking, trackOfferPageViewed, trackSendKitClicked } from '../lib/track.js';

const REVIEW_LINE =
  "A partner dentist licensed in your state reviews your photos and decides whether it's a fit. Placing your order starts that review.";
const HERO = ['16 / 9', 'PLACEHOLDER: Flex Partial with kit on plain background, 1:1, 1200px'];

const FILM = [
  ['1 / 1', 'PLACEHOLDER: Flex Partial three-quarter product shot on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: kit contents on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: partial case on plain background, 1:1, 1200px'],
  ['1 / 1', 'PLACEHOLDER: Flex Partial detail product shot on plain background, 1:1, 1200px']
];


const PAY_NAMES = ['Apple Pay', 'Affirm', 'Visa', 'Mastercard'];

function PayRow() {
  return (
    <ul className="pay-names" aria-label="Ways to pay">
      {PAY_NAMES.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ARCH_WORD = { upper: 'Top', lower: 'Bottom' };
const toothWord = (t) => {
  const n = teethCount(t);
  return `${n === 6 ? '6+' : n} ${n === 1 ? 'tooth' : 'teeth'}`;
};

function PartialPhoto({ arch, teeth }) {
  const src = partialImage(arch, teeth);
  const [failed, setFailed] = useState(false);
  const n = teethCount(teeth);
  const label = `${arch === 'lower' ? 'Lower' : 'Upper'} partial` + (teeth ? ` · ${n === 6 ? '6+' : n} ${n === 1 ? 'tooth' : 'teeth'}` : '');
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
    const src = partialImage(slide.arch, teeth[slide.arch]);
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
    ...(arch === 'both' ? ['upper', 'lower'] : arch ? [arch] : []).map((a) => ({ kind: 'partial', arch: a, key: `p-${a}` })),
    ...FILM.map(([ratio, text], i) => ({ kind: 'ph', text, ratio, short: ['Angle', 'Kit', 'Case', 'Detail'][i], key: `f-${i}` }))
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [arch, teeth.upper, teeth.lower]);
  const current = slides[Math.min(index, slides.length - 1)];
  return (
    <div className="pg">
      <div className="pg-main">
        {current.kind === 'partial' ? (
          <PartialPhoto key={`${current.arch}-${teeth[current.arch]}`} arch={current.arch} teeth={teeth[current.arch]} />
        ) : (
          <div className="rec-photo">
            <ImagePlaceholder text={current.text} ratio="3 / 2" />
          </div>
        )}
      </div>
      <div className="pg-thumbs" role="tablist" aria-label="Product photos">
        {slides.map((slide, i) => (
          <button
            key={slide.key + teeth.upper + teeth.lower}
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
// "How many teeth to replace?" — one picker per arch; Both shows top and bottom separately.
function TeethPickers({ arch, teeth, setTeeth }) {
  return (arch === 'both' ? ['upper', 'lower'] : [arch]).map((a) => (
    <React.Fragment key={a}>
      <p className="pick-label">
        How many teeth to replace
        {arch === 'both' && (
          <>
            {' on the '}
            <strong className="pick-arch">{a === 'upper' ? 'top' : 'bottom'}</strong>
          </>
        )}
        ?
      </p>
      <div className="teeth-row" role="group" aria-label={a === 'upper' ? 'Top teeth' : 'Bottom teeth'}>
        {TEETH.map((n) => (
          <button
            key={n}
            type="button"
            className={teeth[a] === n ? 'teeth-tile is-on' : 'teeth-tile'}
            aria-pressed={teeth[a] === n}
            aria-label={`${n} ${n === '1' ? 'tooth' : 'teeth'} on the ${a === 'upper' ? 'top' : 'bottom'}`}
            onClick={() => setTeeth((prev) => ({ ...prev, [a]: n }))}
          >
            {n}
          </button>
        ))}
      </div>
    </React.Fragment>
  ));
}


// Quiz result hero: big blue card, the partial(s) for their answers, short callouts on top.
function HeroShot({ arch, teeth }) {
  const [failed, setFailed] = useState(false);
  const src = partialImage(arch, teeth);
  return failed ? (
    <div className="hero-fallback" aria-hidden="true">
      <span>{arch === 'lower' ? 'Bottom' : 'Top'} partial</span>
    </div>
  ) : (
    <img src={src} alt={`${arch === 'lower' ? 'Bottom' : 'Top'} partial, ${toothWord(teeth)}`} width="1200" height="800" onError={() => setFailed(true)} />
  );
}

function HeroCard({ shots, teeth }) {
  return (
    <figure className={shots.length > 1 ? 'hero-card is-both' : 'hero-card'}>
      <span className="hero-tag">Kit included</span>
      <div className="hero-shots">
        {shots.map((a) => (
          <HeroShot key={`${a}-${teeth[a]}`} arch={a} teeth={teeth[a]} />
        ))}
      </div>
      <span className="hero-chip">Made in a U.S. lab</span>
    </figure>
  );
}

// Image tile for picking the partial (photo, name, price, optional ribbon).
function PartialTile({ on, onClick, ribbon, name, sub, price, img }) {
  const [failed, setFailed] = useState(false);
  return (
    <button type="button" className={on ? 'ptile is-on' : 'ptile'} aria-pressed={on} onClick={onClick}>
      {ribbon && <span className={ribbon === 'Recommended' ? 'ptile-ribbon' : 'ptile-ribbon is-alt'}>{ribbon}</span>}
      <span className="ptile-name">{name}</span>
      <span className="ptile-img">
        {failed ? <span className="ptile-ph" aria-hidden="true" /> : <img src={img} alt="" onError={() => setFailed(true)} />}
      </span>
      <span className="ptile-sub">{sub}</span>
      <span className="ptile-price">{price}</span>
    </button>
  );
}

// Image band further down the page: headline + callouts over a photo.
function Band({ src, title, points }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={failed ? 'band no-img' : 'band'}>
      {!failed && <img src={src} alt="" onError={() => setFailed(true)} />}
      <figcaption>
        <span className="band-title">{title}</span>
        <span className="band-points">
          {points.map((pt) => (
            <span key={pt}>{pt}</span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

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
  // Separate counts so 'Both' can be e.g. 2 on top and 3 on the bottom.
  // /shop starts with nothing picked (no quiz answers); the quiz result starts from the answers.
  const [teeth, setTeeth] = useState(direct ? { upper: null, lower: null } : { upper: answers.teeth || '1', lower: answers.teeth || '1' });
  // Quiz takers who said "both" start on one arch; the second arch comes back at the both-arch total.
  const [arch, setArch] = useState(direct ? null : initial.arch === 'both' ? 'upper' : initial.arch);
  const [selected, setSelected] = useState(initial.selected);
  const [details, setDetails] = useState(false);
  const [bothOpen, setBothOpen] = useState(false);
  const detailsRef = useRef(null);
  const howRef = useRef(null);
  const checkoutRef = useRef(null);
  const [sticky, setSticky] = useState(false);
  const offer = offerForAnswers({ arch: arch || 'upper' });
  const needArches = arch === 'both' ? ['upper', 'lower'] : arch ? [arch] : [];
  const ready = !direct || (needArches.length > 0 && needArches.every((a) => teeth[a]));
  const active = activeChoice(offer, selected);
  const oneArchPrice = activeChoice(offerForAnswers({ arch: 'upper' }), selected).price;
  const bothPrice = activeChoice(offerForAnswers({ arch: 'both' }), selected).price;
  const secondArchPrice = bothPrice - oneArchPrice;
  const secondArchOff = oneArchPrice - secondArchPrice;
  const shots = arch === 'both' ? ['upper', 'lower'] : [arch];

  useEffect(() => {
    trackOfferPageViewed();
    setupScrollTracking();
  }, []);

  // Checkout bar pinned to the bottom whenever the main checkout button is off screen.
  useEffect(() => {
    const el = checkoutRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setSticky(!entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reward = rewardEarned();
  const total = Math.max(0, active.price - (reward ? SMS_REWARD.amount : 0));
  const orderArches = arch === 'both' ? ['upper', 'lower'] : arch ? [arch] : [];
  const orderSpec = orderArches.map((a) => `${ARCH_WORD[a]}: ${toothWord(teeth[a])}`).join(' · ');

  const openDetails = (target) => {
    setDetails(true);
    requestAnimationFrame(() => {
      const el = (target === 'how' ? howRef : detailsRef).current;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const buy = (event) => {
    event.preventDefault();
    if (!ready) return;
    const tracking = { ...trackSendKitClicked(active.sku, offer.arch, active.price), ...toothAttributes(offer.arch, teeth), ...rewardParams() };
    if (offer.arch === 'both') checkoutBothArches(active.sku, tracking);
    else checkoutOneArch(active.sku, offer.arch, tracking);
  };

  return (
    <main data-screen-label="Offer" data-arch={offer.arch} className={inPersonFirst ? 'offer-screen has-visit' : 'offer-screen'}>
      {!direct && (
        <header className="cr-head">
          <p className="cr-eyebrow">Your case results</p>
          <h1 className="cr-title">
            <span className="cr-brand">Flex Partial</span> may be a fit for you.
          </h1>
          <ul className="cr-tags" aria-label="Your answers">
            {(arch === 'both' ? ['upper', 'lower'] : [arch]).map((a) => (
              <li key={a}>
                {ARCH_WORD[a]} · {toothWord(teeth[a])}
              </li>
            ))}
          </ul>
        </header>
      )}
      <div className="offer-top rec">
        {direct ? (
          <ProductGallery arch={arch} teeth={teeth} />
        ) : (
          <HeroCard shots={shots} teeth={teeth} />
        )}

        <div className="offer-buy">
          {direct ? (
            <>
              <h1 className="offer-title">{active.name}</h1>
              <p className="offer-price" data-shop-price>{arch ? money(active.price) : `From ${money(oneArchPrice)}`}</p>
              {reward && (
                <p className="reward-line" data-reward>
                  Your {money(SMS_REWARD.amount)} off is applied at checkout
                </p>
              )}
              <p className="offer-note">{REVIEW_LINE}</p>
            </>
          ) : (
            <p className="cr-lead">
              From <strong data-match-price>{money(offer.flex.price)}</strong>. Custom-made from your own impressions. A dentist
              licensed in your state reviews your case before anything is made.
            </p>
          )}

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

          {direct && arch && <TeethPickers arch={arch} teeth={teeth} setTeeth={setTeeth} />}

          {!direct && (
            <>
              <p className="opt-label">Choose your partial</p>
              <div className="ptiles" role="group" aria-label="Partial choices">
                <PartialTile
                  on={selected === 'flex'}
                  onClick={() => setSelected('flex')}
                  ribbon="Recommended"
                  name="Flex Partial"
                  sub="Flexible, lightweight"
                  price={money(offer.flex.price)}
                  img="/images/offer/flex-tile.jpg"
                />
                <PartialTile
                  on={selected === 'precision'}
                  onClick={() => setSelected('precision')}
                  ribbon="Upgrade"
                  name="Precision Pro"
                  sub="Milled, firmer feel"
                  price={money(offer.precision.price)}
                  img="/images/offer/precision-tile.jpg"
                />
              </div>
            </>
          )}
          {direct && (<>
          <p className="pick-label">Choose your partial</p>
          <div id="offer-cards" className="plan-list" role="group" aria-label="Partial choices">
            <button
              type="button"
              className={selected === 'flex' ? 'plan-row is-on' : 'plan-row'}
              aria-pressed={selected === 'flex'}
              onClick={() => setSelected('flex')}
            >
              <span className="plan-name">
                <span className="plan-name-row">
                  Flex Partial
                  {!direct && <span className="rec-badge">Recommended</span>}
                </span>
                <span className="plan-sub">Flexible, lightweight, gum-colored</span>
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
                <span className="plan-sub">Milled upgrade, firmer feel</span>
              </span>
              <span className="plan-price">{money(offer.precision.price)}</span>
            </button>
          </div>
          </>)}

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

          {!direct && arches.length > 1 && (
            <>
              <p className="opt-label">Your plan</p>
              <div className="plan-list" role="group" aria-label="Arch">
                <button
                  type="button"
                  className={arch !== 'both' ? 'plan-row plan-row-stack is-on' : 'plan-row plan-row-stack'}
                  aria-pressed={arch !== 'both'}
                  onClick={() => setArch(arch === 'both' ? 'upper' : arch)}
                >
                  <span className="plan-top">
                    <span className="plan-title">Just one arch for now</span>
                    <span className="plan-price">{money(oneArchPrice)}</span>
                  </span>
                  <span className="plan-detail" data-second-arch>
                    If you're satisfied, we'll take {money(secondArchOff)} off your second arch:
                    <span className="second-price">
                      <s>{money(oneArchPrice)}</s> <strong>{money(secondArchPrice)}</strong>
                    </span>
                    <span className="second-when">
                      Order within 60 days after your first case is finished.
                    </span>
                  </span>
                </button>
                {arch !== 'both' && (
                  <div className="pick-row pick-row-2" role="group" aria-label="Which arch first">
                    {[['upper', 'Top'], ['lower', 'Bottom']].map(([value, label]) => (
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
                )}
                <div className={bothOpen || arch === 'both' ? 'both-drop is-open' : 'both-drop'}>
                  <button
                    type="button"
                    className="both-toggle"
                    aria-expanded={bothOpen || arch === 'both'}
                    onClick={() => setBothOpen((v) => !v)}
                  >
                    <span>I'm interested in replacing both top and bottom</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {(bothOpen || arch === 'both') && (
                    <div className="both-body">
                      <p className="both-line">
                        Both arches together:{' '}
                        <span className="second-price">
                          <s>{money(oneArchPrice * 2)}</s> <strong>{money(bothPrice)}</strong>
                        </span>
                      </p>
                      <p className="both-note">{money(oneArchPrice * 2 - bothPrice)} less than ordering each arch on its own.</p>
                      <button
                        type="button"
                        className={arch === 'both' ? 'both-pick is-on' : 'both-pick'}
                        aria-pressed={arch === 'both'}
                        onClick={() => setArch(arch === 'both' ? 'upper' : 'both')}
                      >
                        {arch === 'both' ? 'Both arches selected ✓' : `Choose both for ${money(bothPrice)}`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {arch === 'both' && <TeethPickers arch="both" teeth={teeth} setTeeth={setTeeth} />}
            </>
          )}

          <p className={direct ? "offer-selected" : "offer-selected sr-only"} data-selected-offer>
            {ready ? purchaseLine(active) : !arch ? 'Pick your arch to see your price' : 'Pick how many teeth to replace'}
          </p>
          <a
            ref={checkoutRef}
            className={ready ? (direct ? 'offer-checkout' : 'offer-checkout atc') : 'offer-checkout is-locked'}
            data-checkout
            href={ready ? active.url : undefined}
            aria-disabled={!ready}
            onClick={buy}
          >
            <span>{ready ? (direct ? 'Continue to checkout' : 'Add to cart') : 'Choose your options above'}</span>
            <span>{ready ? money(direct ? active.price : total) : ''}</span>
          </a>

          {direct ? (
            <div className="cr-assure">
              <p className="cr-secure">
                <LockIcon />
                <span>Secure checkout. Pay in full, or choose {AFFIRM_LINE}.</span>
              </p>
              <PayRow />
            </div>
          ) : (
            <>
              <div className="atc-panel">
                {reward && (
                  <p className="atc-reward" data-reward>
                    Your {money(SMS_REWARD.amount)} text signup savings is applied <CheckIcon />
                  </p>
                )}
                <PayRow />
              </div>

              <div className="or-divider atc-or" aria-hidden="true">
                <span>OR</span>
              </div>

              <a className="affirm-btn" href={active.url} onClick={buy} data-affirm>
                Pay over time with Affirm
              </a>
              <div className="affirm-panel">
                <p>Choose Affirm at checkout. Monthly payments, subject to eligibility.</p>
              </div>
            </>
          )}

          {!direct && (
            <>
              <div className="cr-promise">
                <p className="cr-promise-title">Nothing is made until a dentist says yes.</p>
                <p>{DENTIST_LINE}</p>
                <a href={LINKS.refund} target="_blank" rel="noopener" className="cr-policy">
                  Read our refund policy
                </a>
              </div>

              <Band
                src="/images/offer/kit-band.jpg"
                title="Everything comes in one kit"
                points={['Impression trays', 'Step-by-step guide', 'Prepaid return']}
              />

              <section className="cr-steps" aria-label="What happens after you order">
                <h2>What happens after you order</h2>
                <ol>
                  {ORDER_STEPS.map(([title, body]) => (
                    <li key={title}>
                      <span className="cr-step-title">{title}</span>
                      <span className="cr-step-body">{body}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="faq cr-faq" aria-label="Questions">
                {QUIZ_FAQ.map(([title, body], i) => (
                  <details key={title} className="faq-row">
                    <summary>
                      <span>{title}</span>
                      <span className="faq-plus" aria-hidden="true">+</span>
                    </summary>
                    <p>
                      {body}
                      {i === QUIZ_FAQ.length - 1 && (
                        <>
                          {' '}
                          <a href={LINKS.refund} target="_blank" rel="noopener" className="cr-policy">
                            Refund policy
                          </a>
                        </>
                      )}
                    </p>
                  </details>
                ))}
              </section>
            </>
          )}

          {direct && (
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
          )}
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

      {ready && (
        <div className={sticky ? 'cr-sticky is-on' : 'cr-sticky'} aria-hidden={!sticky}>
          <span className="cr-sticky-name">
            {active.name}
            <strong>{money(direct ? active.price : total)}</strong>
          </span>
          <a href={active.url} onClick={buy} tabIndex={sticky ? 0 : -1}>
            Checkout
          </a>
        </div>
      )}

      <p className="offer-contact">
        Questions?{' '}
        <a href={`mailto:${LINKS.email}`} className="offer-mail">{LINKS.email}</a>
      </p>
    </main>
  );
}
