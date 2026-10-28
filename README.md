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

Five questions, one per screen, tap-to-advance (~170ms), then an email gate, then the result.

1. Where are your missing teeth?
2. About how many teeth are you missing?
3. Tooth removed in the last 90 days?
4. Tooth pain or swelling?
5. Loose or shifting teeth?
6. Email gate — required before any result
7. Offer, or the healing pause

**Email gate.** The offer and the healing pause both stay hidden until a valid email is submitted. First name is optional. There is no skip control. Back returns to the question they just left; it does not reveal the result.

**Routing.** A "Yes" on question 3 (recent extraction) opens the email gate and, after submit, the healing pause. A "Yes" on pain or loose teeth does not pause the quiz. Those visitors still submit email, then see the offer with a note to see a licensed dentist in your state in person first. The order cards stay on that screen.

The back arrow from a result returns to the email gate, not past it.

**Where the lead goes.** This repo has no waitlist route. The marketing account already in use is Klaviyo site ID `XaqymG` (Shopify metafield `klaviyo.company_id` on `tfvziu-ia.myshopify.com`). The browser posts to same-origin `POST /api/quiz-lead`, and that function writes a profile plus a `Quiz Results Requested` event to `https://a.klaviyo.com/client/profiles/` and `/client/events/`. Klaviyo’s browser preflight is not usable here, and its onsite forms are off, so no list ID is published. Set `KLAVIYO_LIST_ID` on the server to also subscribe that profile via `/client/subscriptions/`. Saved fields are email, optional first name, and coded quiz answers — not photos or a medical note.

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
| Email gate | `src/components/EmailGate.jsx` |
| Lead save (Klaviyo) | `src/lib/lead.js` |
| Prices, Affirm lines, checkout URLs, policy links | `src/config.js` |
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
    ├── config.js           # pricing, checkout URLs, policy links
    ├── styles.css          # resets, link colors, keyframes
    ├── data/questions.js
    └── components/
        ├── Header.jsx
        ├── ProgressBar.jsx
        ├── QuestionScreen.jsx
        ├── EmailGate.jsx
        ├── PauseScreen.jsx
        ├── OfferScreen.jsx
        ├── ProofBlock.jsx
        ├── ValueList.jsx
        ├── HowItWorks.jsx
        ├── ProductCard.jsx
        ├── ImageSlot.jsx
        ├── Check.jsx
        └── Footer.jsx
```
