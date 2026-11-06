# Klyros — Find Your Fit quiz funnel

Mobile-first qualification quiz. Name and email are collected on step 1, before
the questions. Checkout opens the matching Shopify cart variant. Quiz answers
are not sent with the lead.

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
| `beforecomp.png` | Offer — BEFORE. Shown at the file's own ratio so the lower space stays in frame. |
| `aftercomp.png` | Offer — AFTER, paired with the before photo. |
| `lightcomp.png` / `darkcomp.png` | Product reference photos (not used on the offer). |
| `klyros-logo.png` | Header logo (already included) |

`.jpg` or `.png` both work — if you use `.png`, update the `src` in
`src/components/ProofBlock.jsx` / `OfferScreen.jsx`.

## Flow

Name and email on step 1, then five questions, one per screen, tap-to-advance (~170ms), then the result. There is no second email step.

1. First name and email
2. Where are your missing teeth?
3. About how many teeth are you missing?
4. Tooth removed in the last 90 days?
5. Tooth pain or swelling?
6. Loose or shifting teeth?
7. Offer, or the healing pause

**Step 1.** A valid email is required before any question. First name is optional. There is no skip control. Back from the first question returns to step 1. Submitting the same name and email again does not send another lead.

**Routing.** A "Yes" on the extraction question opens the healing pause. A "Yes" on pain or loose teeth does not pause the quiz. Those visitors see the offer with a note to see a licensed dentist in your state in person first. The order cards stay on that screen.

The back arrow from a result returns to the question they just left.

**Where the lead goes.** This repo has no waitlist route. The marketing account already in use is Klaviyo site ID `XaqymG` (Shopify metafield `klaviyo.company_id` on `tfvziu-ia.myshopify.com`). The browser posts to same-origin `POST /api/quiz-lead`, and that function writes a profile plus a `Quiz Results Requested` event to `https://a.klaviyo.com/client/profiles/` and `/client/events/`. Klaviyo’s browser preflight is not usable here, and its onsite forms are off, so no list ID is published. Set `KLAVIYO_LIST_ID` on the server to also subscribe that profile via `/client/subscriptions/`. Saved fields are email and an optional first name only. Quiz answers are not sent. List id is still unknown until it is set in `KLAVIYO_LIST_ID`.

## Checkout hand-off

Checkout opens the Shopify cart for the variant that matches the product and the arch from question 1 (upper, lower, or both). Quiz answers are not put on the URL. Prices live in `PRICING`: Flex $489 / $859 both, Precision $789 / $1,479 both.

## Editing content

| What | Where |
| --- | --- |
| Questions, options, routing | `src/data/questions.js` |
| Email gate | `src/components/EmailGate.jsx` |
| Lead save (Klaviyo) | `src/lib/lead.js` |
| Prices, Affirm line, shipping line, dentist line, policy links | `src/config.js` |
| Offer page layout and copy | `src/components/OfferScreen.jsx` |
| Included list | `src/components/ValueList.jsx` |
| 4-step explainer | `src/components/HowItWorks.jsx` |
| Legal footer | `src/components/Footer.jsx` |

Prices live in one place — `PRICING` in `src/config.js`. One-arch and both-arch
amounts are the Shopify prices.

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
        ├── ImageSlot.jsx
        ├── Check.jsx
        └── Footer.jsx
```
