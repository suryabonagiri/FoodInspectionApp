# Hyderabad Food Inspection Transparency

A lightweight React civic-data interface for browsing publicly available food inspection information in Hyderabad. It is an independent transparency interface, not an official government website.

## Stack

- React + Vite
- Tailwind CSS
- Firebase Firestore and Email/Password Authentication (optional)
- Lucide React icons

Without Firebase variables, the application uses a local catalogue with demo samples, bundled historical inspection records, and browser-saved additions.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Firebase setup

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com/).
2. Add a Web app and copy its configuration values.
3. Create a Firestore database.
4. In **Authentication → Sign-in method**, enable **Email/Password**.
5. In **Authentication → Users**, create the admin user who may publish records.
6. Copy `.env.example` to `.env.local` and fill in the `VITE_FIREBASE_*` values. Do not commit this file.
7. Deploy the rules in `firestore.rules`. They expose read-only public data and only allow authenticated writes.

Example `.env.local`:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Data model

Firestore uses two top-level collections:

- `restaurants/{restaurantId}` holds the current public summary.
- `inspections/{inspectionId}` holds each individual inspection and its `restaurantId` relationship.

Inspection records intentionally keep their own source URL and source handle. The interface never fabricates missing source links, scores, or enforcement data.

## Admin ingestion

After Firebase authentication, visit `/admin` and paste a public source update. The app parses common labels, normalizes restaurant/locality names, looks for an existing entity, exposes an editable preview, then saves the restaurant summary and inspection separately.

Duplicate source URLs are rejected. The identity resolver uses normalized name plus locality; a name-only match is surfaced for an administrator to confirm rather than being merged aggressively.

In Phase 1 Demo Data Mode, `/admin` uses the temporary local credentials `Admin` / `Admin` to access the parser preview. This only hides the workflow in a local prototype; it is not production authentication. Reviewed records are saved in browser localStorage and update the local directory; they are not shared across devices. Firebase Authentication will replace it before deployment.

## Extending the data

- Add government handles in `src/utils/parser.js` (`GOVERNMENT_HANDLES`). These labels do not imply affiliation.
- Add violation aliases in `src/utils/violationDetector.js`. The recurring detector counts normalized concern categories across inspection records.
- `generateConsumerSummary` is deterministic today. Its TODO documents how to add Gemini/OpenAI later through a secure server-side function; never add an AI secret to frontend variables.

## Deploy to Vercel

1. Push this repository to GitHub and import it into Vercel.
2. Use the default Vite build command: `npm run build`, output directory: `dist`.
3. Add the same Firebase variables from `.env.local` in Vercel Project Settings → Environment Variables.
4. Redeploy. Configure your host to rewrite SPA routes to `index.html` so `/admin` and `/restaurant/:id` load directly.

Firebase Hosting and GitHub Pages are also suitable SPA hosts when their route fallback/configuration is set up.

## Current status and roadmap

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the September 2026 review, completed improvements, verification limits, and the phase 2 Firebase/AI import plan. The Firebase scaffold requires authorization and ingestion hardening before production use.

Run regression checks with `node --test`. The directory supports sorting and export of filtered records to CSV.

## Customer submissions

The Submit data tab prepares an email draft to suryabonagiri69@gmail.com. Customers must send it from their email app; the website does not deliver emails automatically. The Admin tab supports manual entry and pasted-source parsing, plus a link to Gmail for reading submissions. There is no embedded email inbox.

## Restaurant deletion and visual theme

After signing into Admin, use Manage restaurants → Delete → Move to Trash. Trash → Restore makes the restaurant and retained inspection history visible again. This is reversible removal from the interface, not permanent erasure from storage. In local mode this persists only in the current browser. Firebase mode stores a deletedAt marker; existing Firestore public-read rules still permit direct data access. No existing records were deleted during this change.

The green-and-peach theme uses generated decorative food photography, not photographs of listed restaurants. See design-assets/IMAGE_PROMPTS.md for asset paths and generation prompts.

## Sourced review batch — 11 September 2026

Admin includes ten historical inspection drafts in “10 sourced records to review.” Click Review record to populate the editable form, check the evidence, then save. Drafts do not change the public directory until saved. Each has a stable import key so records sharing one news report can be saved separately without reimporting the same draft.

The three handles were inferred from the app configuration because no new handle list accompanied the request. Direct X profile/post requests failed; this is a secondary-source research snapshot, not a successful direct X scrape or a live feed. Seven CMC entries come from two NDTV reports, two MMC entries from Hyderabad Mail and Munsif Daily, and one TG SAFE entry from indexed Sotwe content. Evidence URLs, source type and retrieval date are preserved in src/data/researchedInspections.js. Missing scores remain null. Recheck official posts and subsequent updates before publication; no claim is made that these describe present restaurant conditions.

Home now explains the purpose as “Check restaurant hygiene before you dine.” The complete source-data format is on Share restaurant info (formerly Submit data).


## Published research batch — 17 September 2026

The local directory now includes nine sourced establishments alongside the three existing demo samples: Shah Gouse (Raidurg), Mehfil (Hitech City), Ideal Kitchen (Madhapur), Dasara (Nagole), Al Matam Al Madina Mandi (Yousufguda), and four Banjara Hills establishments inspected on 10 September 2026: Girl Friend Mandi, Kholani’s Fine Dine Restaurant, Lakshmi Sri Balaji Sweets and Bakery, and Kakatiya Tiffins Meals and Snacks.

`src/data/publishedInspections.js` preserves evidence URLs, recovered original X links, research date and verification limits. The four September records are supported by Siasat and Hyderabad Mail reports; their exact X post URL remains unavailable. Scores stay null when unreported. Stop-operation enforcement is explicitly represented and maps to the existing Critical status; it describes the historical inspection, not a verified current closure.

Existing admin imports are merged by import key, preserving edits and trash markers. Four previously queued drafts are now bundled in the public local directory, leaving six older drafts to review on a fresh browser. Search, filters, detail pages, histories and CSV export use the same data flow. Firebase-backed directories still use their Firestore data; all research drafts remain available for review/import there. No cloud records were written or site deployed.

Validation: 10 Node tests and the production build pass. Browser checks verified the 12-record directory, search for Girl Friend Mandi, and its findings, missing score and source links on the detail page. The existing Firebase bundle-size/import warnings remain.


## Additional government news batch — 17 September 2026

Added the six requested restaurants: Hotel Sangeeth Grand Restaurant and Bar, Bahar Biryani Café, Chemistry Bar and Kitchen (Surabhi Grand), Hotel Kinara Grand, Mandi King Arabian Restaurant, and Hotel Sitara Grand. The fresh local catalogue now contains 18 restaurants (15 sourced records plus three demo samples).

The first four retain a September 16 news report date and an unknown inspection date; their location is the reported LB Nagar drive area, not a confirmed branch address. The two Kukatpally records retain the September 9 inspection date. All six have news evidence and corroborating report links, with no invented scores or individual violations. The existing Latest inspection sort/date filters continue to use actual inspection dates; records with unknown dates sort after dated inspections. CSV now preserves the news report date separately.

See [RESTAURANT_NEWS_RESEARCH.md](RESTAURANT_NEWS_RESEARCH.md) for search keywords and three further government-post leads (Udupi Upahar Moosapet, KFC Kondapur, Shilpi Elite Chaitanyapuri). Those leads are research only, not additional published records.

Validation: all 11 tests and the production build pass. Browser checks confirmed 18 restaurants, search for Kinara, and the detail page's unknown inspection date, distinct report date and evidence links. Existing Firebase build warnings remain; no deployment or cloud writes were performed.
