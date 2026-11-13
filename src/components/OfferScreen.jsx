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
  WHY_ROWS,
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


// Accepted-payment marks (Apple Pay and Visa paths from Simple Icons; Mastercard's two circles).
// Affirm has its own button under the OR, so it isn't repeated here.
const PAY_MARKS = [
  {
    name: 'Apple Pay',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#000000" d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z" />
      </svg>
    )
  },
  {
    name: 'Visa',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#1A1F71" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
      </svg>
    )
  },
  {
    name: 'Mastercard',
    svg: (
      <svg viewBox="0 0 24 16" aria-hidden="true">
        <circle cx="8.5" cy="8" r="6" fill="#EB001B" />
        <circle cx="15.5" cy="8" r="6" fill="#F79E1B" />
        <path fill="#FF5F00" d="M12 3.2a6 6 0 0 1 0 9.6a6 6 0 0 1 0-9.6z" />
      </svg>
    )
  }
];

function PayRow() {
  return (
    <ul className="pay-marks" aria-label="Ways to pay">
      {PAY_MARKS.map((m) => (
        <li key={m.name} title={m.name} className={m.name === 'Apple Pay' ? 'is-apple' : undefined}>
          {m.svg}
          <span className="sr-only">{m.name}</span>
        </li>
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

// Flex vs. Precision Pro, from the product facts. Price row is added from Shopify pricing.
// What's different first (strongest first), then what both include.
const COMPARE_ROWS = [
  ['Material', 'DuraFlex', 'Valplast'],
  ['Handmade', 'Start to finish', 'Finished by hand'],
  ['Build process', 'More thorough', 'Standard'],
  ['Longer lifespan', '✓', '—'],
  ['Warranty', '1 year', '—']
];
const SHARED_ROWS = ['Impression kit', 'Dentist review', 'U.S. dental lab', '2-day shipping', 'Klyros Fit Assurance'];

const YesMark = ({ strong }) => (
  <span className={strong ? 'yes-mark is-strong' : 'yes-mark'} role="img" aria-label="Yes">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);
const NoMark = () => <span className="no-mark" role="img" aria-label="No" />;
const cellValue = (v, strong) => (v === '✓' ? <YesMark strong={strong} /> : v === '—' ? <NoMark /> : v);

// Low end of the typical U.S. dental office fee range for a partial denture (ADA fee survey data via
// dentalcosts.hellopearl.com, D5213, range $1,250–$3,280, updated May 2026). Shown as a comparison, not as our old price.
const HELP_LINKS = [
  ['How it works', LINKS.howItWorks],
  ['FAQ', LINKS.faq],
  ['About us', LINKS.about],
  ['Refund policy', LINKS.refund],
  ['Privacy policy', LINKS.privacy],
  ['Terms of service', LINKS.terms],
  ['Teledentistry consent', LINKS.consent]
];
const DENTAL_OFFICE_FROM = 1250;

// Affirm's official wordmark (public/images/pay/affirm.png) on a white tab so it reads on the dark button.
function AffirmMark() {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="affirm-word">affirm</span>
  ) : (
    <span className="affirm-chip">
      <img className="affirm-logo" src="/images/pay/affirm.png" alt="Affirm" onError={() => setFailed(true)} />
    </span>
  );
}

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

// Small image that hides itself (shows a soft placeholder) until the real file is dropped in.
function Slot({ src, className, label }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className={className + ' is-empty'} aria-hidden="true">{label}</span>
  ) : (
    <img className={className} src={src} alt="" onError={() => setFailed(true)} />
  );
}

// Corner clip: someone putting the partial in, so it's obvious it's removable. Muted, looping, plays inline.
function InsertClip() {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="hero-clip is-empty" aria-hidden="true">Clip</span>;
  return (
    <video
      className="hero-clip"
      src="/images/offer/insert.mp4"
      poster="/images/offer/insert-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Putting the partial in"
      onError={() => setFailed(true)}
    />
  );
}

function HeroCard({ shots, teeth }) {
  return (
    <figure className={shots.length > 1 ? 'hero-card is-both' : 'hero-card'}>
      <InsertClip />
      <div className="hero-tag">
        <Slot src="/images/offer/kit-corner.png" className="hero-kit" label="Kit" />
        <span>Kit included</span>
      </div>
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
      {ribbon && <span className={ribbon === 'Standard' ? 'ptile-ribbon' : 'ptile-ribbon is-alt'}>{ribbon}</span>}
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

const WHY_ICONS = {
  tooth: <path d="M7 3c-2.5 0-4 2-4 4.5 0 2 1 3.5 1.6 5.6L6 19c.3 1.3 1.9 1.4 2.3.1L10 14h4l1.7 5.1c.4 1.3 2 1.2 2.3-.1l1.4-5.9C20 11 21 9.5 21 7.5 21 5 19.5 3 17 3c-1.9 0-3 1-5 1S8.9 3 7 3z" />,
  box: <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></>,
  // Certified: award rosette with a check
  lab: <><circle cx="12" cy="9" r="6" /><path d="M9.5 9l1.8 1.8 3.3-3.3" /><path d="M8.6 14 7 21.5l5-2.8 5 2.8-1.6-7.5" /></>,
  truck: <><path d="M2 6h11v10H2zM13 10h4l4 3.5V16h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  // Fit: puzzle piece (the part that fills the gap)
  wrench: <path d="M19.44 7.85c-.05.32.06.65.29.88l1.57 1.57c.47.47.7 1.09.7 1.7s-.23 1.24-.7 1.7l-1.61 1.62a.98.98 0 0 1-.84.27c-.47-.07-.8-.48-.97-.92a2.5 2.5 0 1 0-3.21 3.21c.44.17.85.5.92.97a.98.98 0 0 1-.27.84l-1.61 1.61a2.4 2.4 0 0 1-1.71.7 2.4 2.4 0 0 1-1.7-.7l-1.57-1.57a1.03 1.03 0 0 0-.88-.29c-.49.07-.84.5-1.02.97a2.5 2.5 0 1 1-3.24-3.24c.47-.18.9-.53.97-1.02a1.03 1.03 0 0 0-.29-.88L2.7 13.7A2.4 2.4 0 0 1 2 12c0-.62.24-1.23.7-1.7l1.53-1.53c.24-.24.58-.35.92-.3.51.08.88.53 1.07 1.01a2.5 2.5 0 1 0 3.26-3.26c-.48-.19-.93-.56-1.01-1.07-.05-.34.06-.68.3-.92L10.3 2.7A2.4 2.4 0 0 1 12 2c.62 0 1.23.24 1.7.7l1.57 1.57c.23.23.56.34.88.29.49-.07.84-.5 1.02-.97a2.5 2.5 0 1 1 3.24 3.24c-.47.18-.9.53-.97 1.02z" />,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
};

// "What you get with Klyros": one card per row (icon + title, then what you get vs. why it matters).
function WhyKlyros({ href, onBuy, name, price }) {
  return (
    <section className="why" aria-label="What you get with Klyros">
      <h2 className="why-title">
        Everything that's included with your <span>new smile</span>.
      </h2>
      <div className="why-grid">
        {WHY_ROWS.map(([icon, title, get, why]) => (
          <article key={title} className="why-card">
            <header>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {WHY_ICONS[icon]}
              </svg>
              <h3>{title}</h3>
            </header>
            <div className="why-body">
              <span className="why-check" aria-hidden="true"><CheckIcon /></span>
              <span className="why-get">{get}</span>
              <span className="why-why">{why}</span>
            </div>
          </article>
        ))}
      </div>
      <a className="why-cta" href={href} onClick={onBuy} data-checkout-mid>
        <span className="why-cta-text">
          <strong>The sooner your impressions are in, the sooner the lab can start on your partial.</strong>
          <span>{name} · {price}</span>
        </span>
        <span className="why-cta-btn">Start my case</span>
      </a>
    </section>
  );
}

// Fit Assurance block near the bottom: answers "what if it doesn't fit?" before the footer.
// Shows which partial is in the cart: filled "Selected" or an empty "Select".
function SelFlag({ on }) {
  return (
    <span className={on ? 'sel-flag is-on' : 'sel-flag'} aria-hidden="true">
      <span className="sel-dot">
        {on && (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        )}
      </span>
      {on ? 'Selected' : 'Select'}
    </span>
  );
}

function FitAssurance() {
  return (
    <section className="fitassure" aria-label="Klyros Fit Assurance">
      <div className="fitassure-shield" aria-hidden="true">
        <svg viewBox="0 0 64 72" width="86" height="96">
          <path d="M32 3 6 13v22c0 17 11 28 26 34 15-6 26-17 26-34V13L32 3z" fill="#1d4ed8" />
          <path d="M32 9 11 17v18c0 14 9 23 21 28 12-5 21-14 21-28V17L32 9z" fill="#2563eb" />
          <path d="M20 37l8 8 16-17" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="fitassure-ribbon">Fit Assurance</span>
      </div>
      <p className="fitassure-kicker">You're probably wondering&hellip;</p>
      <h2 className="fitassure-title">What if it doesn't fit?</h2>
      <p className="fitassure-lead">It's covered. Every Klyros partial comes with Fit Assurance, at no extra charge.</p>
      <p className="fitassure-body">
        A good fit is the whole point. If yours needs work, we adjust it. If it still isn't right, we remake it once. It's part of
        your order, not an add-on.
      </p>
      <a href={LINKS.refund} target="_blank" rel="noopener" className="fitassure-link">
        Read the Fit Assurance details
      </a>
    </section>
  );
}

// Photo under each timeline step; hidden until the file exists.
function StepPhoto({ src }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img className="tl-photo" src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
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
  const [proOpen, setProOpen] = useState(false);
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

  // Choose / No thanks in the compare chart: set the pick, close the chart, and bring
  // both cards plus the Add to cart total back into view so the change is obvious.
  const pickAndClose = (pick) => {
    setSelected(pick);
    setProOpen(false);
    requestAnimationFrame(() => {
      const el = document.querySelector('.offer-screen .your-partial');
      if (!el) return;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = el.getBoundingClientRect().top + window.scrollY - 14;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    });
  };

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
          <h1 className="cr-title">
            <span className="cr-pill">Based on your results...</span>
          </h1>
          <p className="cr-sub">
            <span className="u-smile">Here are a few of your options.</span>
          </p>
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
            null
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
            <div
              className={selected === 'flex' ? 'your-partial is-sel' : 'your-partial'}
              data-selected={selected}
              role="button"
              tabIndex={0}
              aria-pressed={selected === 'flex'}
              onClick={() => setSelected('flex')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected('flex');
                }
              }}
            >
              <span className="yp-flagrow">
                <span className="yp-badge">Recommended for you</span>
                <SelFlag on={selected === 'flex'} />
              </span>
              <span className="your-partial-name">
                {offer.flex.name}
                <span className="yp-answers">
                  {orderArches.map((a) => (
                    <span key={a} className="yp-row">
                      <span className="yp-k">{arch === 'both' ? ARCH_WORD[a] + ' arch' : 'Arch'}</span>
                      <span className="yp-v">{arch === 'both' ? toothWord(teeth[a]) : ARCH_WORD[a]}</span>
                    </span>
                  ))}
                  {arch !== 'both' && (
                    <span className="yp-row">
                      <span className="yp-k">Teeth to replace</span>
                      <span className="yp-v">{toothWord(teeth[arch]).replace(/ (tooth|teeth)$/, '')}</span>
                    </span>
                  )}
                </span>
              </span>
              <span className="yp-price">
                <span className="yp-ref-label">Traditional options</span>
                <s className="yp-ref">{money(DENTAL_OFFICE_FROM * (offer.arch === 'both' ? 2 : 1))}+</s>
                <span className="your-partial-price">{money(offer.flex.price)}</span>
                <span className="yp-flat">Same price for 1 tooth or 6</span>
              </span>
              <span className="yp-feel">
                <strong>Smile, chew and talk with ease again.</strong> Take it out to clean, to sleep, or whenever you like. It pops
                right back in.
              </span>
            </div>
          )}
          {!direct && (
            <>
              <div
                className={'pro-drop' + (proOpen ? ' is-open' : '') + (selected === 'precision' ? ' is-sel' : '')}
                onClick={(e) => {
                  if (e.target.closest('.pro-cta, .both-body')) return;
                  setSelected('precision');
                }}
              >
                <div
                  className="pro-toggle"
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected === 'precision'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected('precision');
                    }
                  }}
                >
                  <SelFlag on={selected === 'precision'} />
                  <span className="pro-headrow">
                    <span className="pro-name">Precision Partial Pro</span>
                    <span className="pro-price">{money(offer.precision.price)}</span>
                  </span>
                  <span className="pro-why">The same partial, built to last even longer.</span>
                </div>
                <div className="pro-cta-wrap">
                  <button type="button" className="pro-cta" aria-expanded={proOpen} onClick={() => setProOpen((v) => !v)}>
                    {proOpen ? 'Hide the difference' : "What's the difference?"}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {proOpen && (
                  <div className="both-body">
<div className="cmp3" role="table" aria-label="Precision Pro vs. Flex Partial">
                      <div className="cmp3-col cmp3-labels" role="rowgroup">
                        <div className="cmp3-head" aria-hidden="true" />
                        {COMPARE_ROWS.map(([label]) => (
                          <div key={label} className="cmp3-cell" role="rowheader">{label}</div>
                        ))}
                        <div className="cmp3-cell cmp3-sep" role="rowheader">Both include</div>
                        {SHARED_ROWS.map((label) => (
                          <div key={label} className="cmp3-cell" role="rowheader">{label}</div>
                        ))}
                        <div className="cmp3-cell cmp3-price" role="rowheader">Price</div>
                      </div>
                      <div className={selected === 'precision' ? 'cmp3-col cmp3-pro is-sel' : 'cmp3-col cmp3-pro'} role="rowgroup">
                        <span className="cmp3-tag">Upgrade</span>
                        <div className="cmp3-head" role="columnheader">Precision Pro</div>
                        {COMPARE_ROWS.map(([label, pro]) => (
                          <div key={label} className="cmp3-cell" role="cell">{cellValue(pro, true)}</div>
                        ))}
                        <div className="cmp3-cell cmp3-sep" aria-hidden="true" />
                        {SHARED_ROWS.map((label) => (
                          <div key={label} className="cmp3-cell" role="cell"><YesMark strong /></div>
                        ))}
                        <div className="cmp3-cell cmp3-price" role="cell">
                          {money(offer.precision.price)}
                        </div>
                      </div>
                      <div className="cmp3-col cmp3-flex" role="rowgroup">
                        <div className="cmp3-head" role="columnheader">Flex Partial</div>
                        {COMPARE_ROWS.map(([label, , flex]) => (
                          <div key={label} className="cmp3-cell" role="cell">{cellValue(flex, false)}</div>
                        ))}
                        <div className="cmp3-cell cmp3-sep" aria-hidden="true" />
                        {SHARED_ROWS.map((label) => (
                          <div key={label} className="cmp3-cell" role="cell"><YesMark /></div>
                        ))}
                        <div className="cmp3-cell cmp3-price" role="cell">{money(offer.flex.price)}</div>
                      </div>
                    </div>
                    <button type="button" className="both-pick pro-choose" onClick={() => pickAndClose('precision')}>
                      Choose Precision Pro
                    </button>
                    <button
                      type="button"
                      className="pro-skip"
                      onClick={() => pickAndClose('flex')}
                    >
                      No thanks, keep Flex Partial
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!direct && (
            <p className="cr-lead">
              <span className="sr-only" data-match-price>{money(offer.flex.price)}</span>
              Custom-made from your own impressions, with a licensed dentist overseeing your case at every step.
            </p>
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
                    Your {money(SMS_REWARD.amount)} off is applied <CheckIcon />
                  </p>
                )}
                <ul className="atc-value">
                  {[
                    ['Fit', 'Assurance'],
                    ['2-day shipping', 'both ways'],
                    ['Unlimited', 'impression retakes']
                  ].map(([a, b]) => (
                    <li key={a + b}>
                      <YesMark strong />
                      {a}
                      <br />
                      {b}
                    </li>
                  ))}
                </ul>
                <PayRow />
              </div>

              <div className="or-divider atc-or" aria-hidden="true">
                <span>OR</span>
              </div>

              <a className="affirm-btn" href={active.url} onClick={buy} data-affirm>
                <span>Pay over time with</span>
                <AffirmMark />
              </a>
              <div className="affirm-panel">
                <p>Monthly payments at checkout, subject to eligibility.</p>
              </div>

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

      {!direct && (
        <div className="cr-below">
              <WhyKlyros href={active.url} onBuy={buy} name={active.name} price={money(total)} />

              <section className="tl" aria-label="What happens after you order">
                <h2 className="tl-title">What happens after you order</h2>
                <ol className="tl-list">
                  {ORDER_STEPS.map(([title, body, photo], i) => (
                    <li key={title} className="tl-step">
                      <span className="tl-dot">{i + 1}</span>
                      <div className="tl-card">
                        <h3>{title}</h3>
                        <p className="tl-body">{body}</p>
                        <StepPhoto src={photo} />
                      </div>
                    </li>
                  ))}
                </ol>
                <a className="tl-cta" href={active.url} onClick={buy} data-checkout-steps>
                  <span className="tl-cta-btn">Start with step 1</span>
                  <span className="tl-cta-sub">{active.name} · {money(total)}</span>
                </a>
              </section>

              <div className="cr-promise">
                <p className="cr-promise-title">Nothing is made until a dentist says yes.</p>
                <p>{DENTIST_LINE}</p>
                <a href={LINKS.refund} target="_blank" rel="noopener" className="cr-policy">
                  Read our refund policy
                </a>
              </div>
        </div>
      )}

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


      {!direct && (
        <>
          <FitAssurance />
          <a className="final-cta" href={active.url} onClick={buy} data-checkout-end>
            <span className="final-cta-text">
              <strong>Your fit is covered.</strong>
              <em>Next, we send your impression kit.</em>
              <span>{active.name} · {money(total)}</span>
            </span>
            <span className="final-cta-btn">Send my kit</span>
          </a>
        </>
      )}

      <section className="help" aria-label="Contact Klyros">
        <h2 className="help-title">Still have a question?</h2>
        <p className="help-sub">Ask a real person on our team. We're happy to help before you order.</p>
        <div className="help-tiles">
          <a className="help-tile" href={LINKS.sms}>
            <span className="help-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" /></svg>
            </span>
            <span className="help-text"><strong>Text us</strong><span>{LINKS.phone}</span></span>
          </a>
          <a className="help-tile" href={`mailto:${LINKS.email}`}>
            <span className="help-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
            </span>
            <span className="help-text"><strong>Email us</strong><span>{LINKS.email}</span></span>
          </a>
          <a className="help-tile" href={LINKS.contact} target="_blank" rel="noopener">
            <span className="help-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H8l-4 4z" /><path d="M8 9h8M8 12h5" /></svg>
            </span>
            <span className="help-text"><strong>Send a message</strong><span>Use our contact form</span></span>
          </a>
        </div>
        <nav className="help-links" aria-label="Helpful links">
          {HELP_LINKS.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener">{label}</a>
          ))}
        </nav>
      </section>
    </main>
  );
}
