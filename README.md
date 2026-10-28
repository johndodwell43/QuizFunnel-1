# Klyros — Find Your Fit quiz funnel

Mobile-first qualification quiz that ends on a two-option offer and hands off to
Shopify checkout with the quiz answers attached as query params.

React 18 + Vite. No CSS framework, no UI library — styles are inline so the
markup and its styling travel together.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

Node 18+ recommended.

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → import the repo**.
3. Framework preset **Vite** (auto-detected). Build `npm run build`, output `dist`.
4. Deploy. `vercel.json` is included and already sets the build/output and an
   SPA rewrite.

Any static host works too — the build output in `dist/` is plain static files.

## Add the real photos

Image slots render a neutral placeholder until a real file exists at the path.
Drop these into `public/images/` using these exact filenames:

| File | Where it appears |
| --- | --- |
| `patient-before.jpg` | Real Patient Result — BEFORE |
| `patient-after.jpg` | Real Patient Result — AFTER |
| `flexible-partial.jpg` | Flexible Partial card |
| `precision-partial.jpg` | Precision Partial Pro™ card |
| `klyros-logo.png` | Header logo (already included) |

`.jpg` or `.png` both work — if you use `.png`, update the `src` in
`src/components/ProofBlock.jsx` / `OfferScreen.jsx`.

## Flow

Five questions, one per screen, tap-to-advance (~170ms). A qualifying last
answer opens the email gate, then the offer. There is no skip on the gate.

1. Where are your missing teeth?
2. About how many teeth are you missing?
3. Tooth removed in the last 90 days?
4. Tooth pain or swelling?
5. Loose or shifting teeth?
6. Email gate — required email, optional first name, then the offer

**Email gate.** Headline "Where should we send your results?". Email is
required. First name is optional. Microcopy: "We'll email your results. No
spam. Unsubscribe anytime." CTA: "See my results". A "Yes" on question 3, 4,
or 5 still goes to the pause screen and never reaches the gate.

The gate stores a non-PHI lead only (email, optional first name, source
`quiz_results_gate`). Quiz answers are not sent. Destination is the Klaviyo
account already installed on the Shopify store (`tfvziu-ia.myshopify.com`,
public company id `XaqymG`, Klaviyo Email Marketing & SMS). The theme does not
publish a list id and onsite forms are disabled, so `src/lib/lead.js` writes a
Klaviyo profile and a `Quiz Results Requested` event with the public client
API. Klaviyo's Shopify app is the sync between that account and the shop.

**Routing.** A "Yes" on question 3, 4, or 5 routes to the pause screen
(`PauseScreen.jsx`) with copy matched to that answer — healing / pain / loose.
Everyone else reaches the email gate, then the offer. The yellow "extra attention" banner on the offer
renders whenever any flag answer is `yes` (currently unreachable, since all three
route out — it stays in the code so re-enabling a flag is a one-line change in
`data/questions.js`: drop `pauseKind` from a question and its "yes" flows through
to the offer instead).

The back arrow returns to the screen the user left. From the offer that is the email gate; from the email gate or a pause screen it is the question they left.

## Checkout hand-off

`buildCheckoutHref()` in `src/config.js` appends the answers:

```
https://klyrosdental.com/products/flexible-partial-denture?arch=upper&teeth=2-3&flagged=0&utm_source=quiz
https://klyrosdental.com/products/pmma-milled-partial-denture?arch=upper&teeth=2-3&flagged=0&utm_source=quiz
```

- `arch` — `upper` | `lower` | `both`
- `teeth` — `1` | `2-3` | `4-6` | `most`
- `flagged` — `1` when any clinical answer was "yes"
- `utm_source` — always `quiz`

Make sure the Shopify product page reads these to preselect the variant.

## Editing content

| What | Where |
| --- | --- |
| Questions, options, routing | `src/data/questions.js` |
| Prices, Affirm lines (no $, APR, or month count), checkout URLs, policy links, Klaviyo company id | `src/config.js` |
| Results email gate | `src/components/EmailGate.jsx`, `src/lib/lead.js` |
| Offer page layout and copy | `src/components/OfferScreen.jsx` |
| Card copy (included list, small print) | `src/components/ProductCard.jsx` |
| Value list | `src/components/ValueList.jsx` |
| 4-step explainer | `src/components/HowItWorks.jsx` |
| Legal footer | `src/components/Footer.jsx` |

Prices live in one place — `PRICING` in `src/config.js`. Both-arch totals are
computed, so changing a base price updates every derived number.

## Accessibility / quality floor

- All tap targets ≥ 48px; answer buttons are 72px tall.
- Visible focus ring on every interactive element.
- `prefers-reduced-motion` disables all animation and transitions.
- One font family (Inter) in two weights, with a system fallback stack.
- Product/proof photos lazy-load.

## Structure

```
klyros-quiz/
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
├── public/images/          # logo + your photos
└── src/
    ├── App.jsx             # state machine: step, screen, answers, routing
    ├── config.js           # pricing, checkout URLs, policy links, Klaviyo id
    ├── lib/lead.js         # non-PHI results lead → existing Klaviyo account
    ├── styles.css          # resets, link colors, keyframes
    ├── data/questions.js
    └── components/
        ├── Header.jsx
        ├── ProgressBar.jsx
        ├── QuestionScreen.jsx
        ├── PauseScreen.jsx
        ├── EmailGate.jsx
        ├── OfferScreen.jsx
        ├── ProofBlock.jsx
        ├── ValueList.jsx
        ├── HowItWorks.jsx
        ├── ProductCard.jsx
        ├── ImageSlot.jsx
        ├── Check.jsx
        └── Footer.jsx
```
