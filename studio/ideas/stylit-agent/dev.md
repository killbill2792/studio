# Dev: Stylit Agent

Status: proposed; all code later in killbill2792/MVPStyli

## Current vision
Read [exec.md — v1](https://github.com/killbill2792/studio/blob/main/studio/ideas/stylit-agent/exec.md) for the only current vision. This file is implementation design, not a second vision.

## Architecture
The app uses `App.js` route state and `components/BottomBar.js`. `shop` shows an inline grid; `chat` shows `screens/ChatScreen.js`; `account` renders `screens/StyleVaultScreen.js`; `userprofile` renders `screens/UserProfileScreen.js`; `tryon`, `product`, `podshome`, `createpod`, `podlive`, `podguest` and `podrecap` remain. `screens/AccountScreen.js` is not the active account route. Preserve Explore and StyleCraft. Use a Stylist route in place of Shop, not a new app.

Current Shop: `App.js` calls `fetchGarmentsAsProducts` (`lib/garmentUtils.js`) for `GET /api/garments?active_only=true`; `api/garments/index.ts` reads `garments` and optional `garment_sizes`. The Shop grid opens `screens/ProductScreen.js`; Fit Check uses its size mapping and `lib/fitLogic.js`. `lib/productApi.js` contains older direct `products` writes; do not assume that table exists.

Reuse, do not rebuild: `screens/ChatScreen.js`, `lib/productSearch.ts` and `api/searchwebproducts/index.ts` (SerpAPI); `screens/PodsScreen.js`, `PodsHome.js`, `PodLive.js`, `PodGuest.js`, `PodRecap.js`, `lib/pods.ts` (friends/twins/global, timer, votes, guest votes and invites); `lib/colorAnalysis.ts` and `api/analyze-skin-tone/index.ts` (face/color season); `StyleVaultScreen.js` and profiles (manual Fit Profile); `lib/styleEngine.ts` (try-on/vote event fingerprint and style twins); `lib/fitLogic.js` and `components/AskAISheet.js` (rule-based Fit Check). PR #4 owns the only Nano Banana model call path.

```mermaid
flowchart TD
  UI[Stylist image, cards, chat and sheet] --> app[App route and existing context]
  app --> style[Style engine and profiles]
  app --> catalog[Garment and web-search APIs]
  app --> pod[Existing Pods screens and tables]
  app --> tryon[PR4 gated try-on server]
  tryon --> history[Owned storage and try_on_history]
  cron[Vercel nightly schedule - gated] --> tryon
  cron --> push[Expo push - gated]
```

## Workflows
All wait ranges are rough estimates, not measured SLAs. Costs are per use: provider rates are not verified; no paid/live use is authorized by this plan.

### 1. Stylist chat turn — Workflow 1
**Approved by owner 2026-11-10, 10:18 AM PT.**
- Trigger/screen: User types or taps a quick chip in the pinned bar; Stylist stays on the same screen.
- Calls and save: Read allowed profile/color/fit/style signals via lib/styleEngine.ts and existing profile state; route intents locally to advice, existing search or Pod, with a safe short reply. No new paid model by default. Only save conversation if using existing chat_conversations/chat_messages with the user's ownership checks.
- Wait/visible state: Estimated 0.5–2 s for a local answer or 2–5 s if reading profile data; show a short thinking line and keep the image visible.
- Failure: Missing profile or network -> generic advice with retry; do not invent scores.
- Cost per use: Local rules: $0 marginal API; database requests billed under existing Supabase plan; optional model requires later approval.

```mermaid
flowchart TD
  chat[Type or chip] --> intent[Classify intent locally]
  intent --> signals[Read style and profile]
  signals --> reply[Short Stylist reply]
  reply --> action[Update image or offer action]
```

### 2. Elevate / Try On
**Pending owner review.**
- Trigger/screen: Tap Try On on an Elevate item; outfit image remains visible.
- Calls and save: Resolve garment/image and current person photo; server calls PR #4's gated /api/tryon adapter -> Nano Banana -> server-owned image storage and try_on_history. App polls existing status and swaps the displayed image on success.
- Wait/visible state: Estimated 10–20 s for one image (not measured); keep the prior image with progress and ask a style question.
- Failure: Missing photo, TEST gate, quota or failure -> preserve old image and offer retry; never write history client-side.
- Cost per use: Nano Banana provider charge per generation, amount unverified; storage and bandwidth extra. No call if gated.

```mermaid
flowchart TD
  tap[Try On] --> inputs[Check photo and garment]
  inputs --> gated[PR4 gated try-on API]
  gated --> model[Nano Banana via PR4 only]
  model --> stored[Server stores image and history]
  stored --> image[Swap outfit image]
```

### 3. Product catalog sheet
**Pending owner review.**
- Trigger/screen: Stylist says 'tap here to see products'; user taps the link on Stylist.
- Calls and save: For closet inventory use lib/garmentUtils.js -> GET /api/garments -> garments/garment_sizes; for web query use lib/productSearch.ts -> POST /api/searchwebproducts -> SerpAPI if configured. Normalize, cap near 10 and open a sheet. Try On hands product to existing try-on path.
- Wait/visible state: Estimated 1–3 s for catalog results; show ten skeleton slots while fetching and keep chat behind the sheet.
- Failure: Missing products table or search key -> empty-state and retry or closet catalog; no fake stock.
- Cost per use: Garment fetch uses existing backend; web search consumes SerpAPI credits if enabled, price unverified; offline tests mock it.

```mermaid
flowchart TD
  open[Tap products link] --> source{Catalog or web?}
  source -->|Catalog| garments[API garments]
  source -->|Web| serp[Search API SerpAPI]
  garments --> sheet[Ten-card sheet]
  serp --> sheet
  sheet --> tryon[Try On via PR4]
```

### 4. Proactive suggestion to Pod
**Pending owner review.**
- Trigger/screen: Stylist says exactly: “I like this, your style intelligence also rates it high. If you have doubts I can run a Pod; I'd suggest Global.” User says Yes before a Pod starts.
- Calls and save: Get style fingerprint via lib/styleEngine.ts and image from existing try-on; on confirmation open existing createpod route in screens/PodsScreen.js, then lib/pods.ts createPod plus existing invites/votes/recap. Offer Global, friends or twins; no silent Pod creation.
- Wait/visible state: Estimated 1–3 s to create a confirmed Pod; show progress before entering the existing timer/live route.
- Failure: No image, account or create error -> keep suggestion and explain; allow manual retry.
- Cost per use: No new model call; Supabase writes and storage under existing plan; votes add ordinary requests.

```mermaid
flowchart TD
  agent[Proactive suggestion] --> yes{User confirms?}
  yes -->|No| stay[Keep look]
  yes -->|Yes| create[Existing Pods create flow]
  create --> live[Timer, votes, guest, recap]
```

### 5. Style my closet — Workflow 2: closet + three looks
**Approved by owner 2026-11-10, 10:22 AM PT.**

- Trigger/screen: On Stylist, tap **Style my closet**. Enforce upload of **3–4 clothing photos** (not fewer or more). If `profiles.body_image_url` is missing, ask for a full-body photo first. Generation **starts immediately after upload**; no More Looks tap. More Looks retains its separate meaning.
- Calls: On the existing upload path, store user-owned closet photos; read `profiles`, style fingerprint from `lib/styleEngine.ts`, color season, and manual Fit Profile. A **server-side text LLM: OpenAI GPT-4.1 mini, called only by a gated Vercel endpoint** `api/stylist-looks/index.ts` (proposed, not yet installed or approved for live/paid use), reads the photos and those signals and plans three outfits: **Closet** uses only uploaded items; **Elevated** uses a closet base plus 1–2 pieces from `GET /api/garments`; **Makeover** uses entirely new pieces in a style not seen in the user's recorded fingerprint. If the fingerprint cannot show a genuinely new style, mark the result as a suggestion, not a verified first.
- During generation: Ask one question, e.g. “Where are you wearing this — class, date, party?” Save any answer to the user's style profile and use it to shape the looks if it arrives before outfit planning completes; if the user skips or answers later, do not pause generation (use the next run for a late answer). Start the planning request immediately, with a short opportunity for the answer; do not wait for an answer.
- Image calls: The image path in PR #4 accepts **one garment image**. Add a **separate server-side composition step** `api/_lib/stylistOutfitComposite.ts` to combine each outfit's pieces into one garment image; do not edit PR #4's files. Submit the three composites to **PR #4's gated Nano Banana try-on path in parallel**. Never call the image model directly from new code.
- Saved: New **private `closet_items`** table (`user_id`, private per-user storage `image_path`, `type`, `color`, `created_at`) with Supabase RLS and per-user storage rules; **never mix with `garments`**. Three resulting looks go into `try_on_history` by PR #4's **server-only writes**. Save the optional answer to the user's style profile under its ownership rules.
- Wait/screen: **Estimated ~20–30 s total** for three parallel image generations, plus upload/planning/composition time; **rough, unmeasured estimate**, not an SLA. Ask the style question while images load. Show **three swipe cards under the main photo**; tapping one promotes it to the main image. Each card has **Send to Pod** with **Global suggested**, using existing Pod creation after confirmation.
- Failure: If one look fails, show the other two; put **Retry** on the failed card only. If missing full-body photo, fewer/more than 3–4 images, missing consent, or TEST gate disabled, explain the issue without submitting an image. Preserve successful looks.
- Cost per run: **1 text LLM call + 3 image generations**, plus composition, storage and API traffic. Model/image charges are **estimated, not priced or authorized**; use mocks until the relevant service gate is approved. Keep `STYLIT_TRYON_TEST_ENABLED` required for TEST; no production/live use until owner go-live approval.

```mermaid
flowchart TD
  enter[Style my closet on Stylist] --> body{Body image saved?}
  body -->|No| full[Ask full-body photo first]
  full --> body
  body -->|Yes| uploads[Enforce 3 to 4 clothing photos]
  uploads --> stored[Private closet_items and storage]
  stored --> both[Start outfit planning immediately]
  both --> question[Ask optional style question]
  question --> answer{Answer arrives in time?}
  answer -->|Yes| profile[Save to style profile and shape outfits]
  answer -->|No or skip| default[Continue without answer]
  profile --> planner[Server GPT-4.1 mini plans 3 looks]
  default --> planner
  planner --> composite[Compose one garment image per look]
  composite --> parallel[3 parallel PR4 gated try-ons]
  parallel --> history[Server-only try_on_history]
  history --> cards[3 swipe cards below main image]
  cards --> select[Tap to promote main image]
  cards --> pod[Send to Pod with Global suggested]
  parallel --> failure[Failed card gets Retry; keep successes]
```

### 6. Tomorrow's look nightly
**Pending owner review.**
- Trigger/screen: User opts in; existing Vercel scheduled job runs nightly in the user's time zone.
- Calls and save: Scheduled Vercel function verifies auth/ownership and opt-in in Supabase, reads private closet, approved calendar event and consented location/weather, builds candidate look, calls PR #4 image service if enabled, stores user-owned result and delivery state, sends Expo push with image/link. No external bot. Nightly service and push go live only after owner approval.
- Wait/visible state: Estimated 10–30 s of server work after the scheduled nightly start (not an interactive wait); show delivery status and the resulting next-day image.
- Failure: No permissions/data, weather failure, job retry or Expo push failure -> skip or show safe closet-only suggestion; dedupe sends; never leak calendar/location.
- Cost per use: Potential image generation per opted-in user/night + weather/API + Vercel/Supabase + Expo push; prices unverified; disabled until go-live gate.

```mermaid
flowchart TD
  cron[Nightly Vercel cron] --> consent[Check opt-in and user TZ]
  consent --> sources[Closet calendar weather]
  sources --> image[PR4 image path if gated on]
  image --> save[Store owned result and dedupe]
  save --> push[Expo push with image]
```

### 7. Find and buy
**Pending owner review.**
- Trigger/screen: Stylist says “I found this” before recommending a product; user taps Shop this item.
- Calls and save: Use existing search/catalog and Fit Profile measurements in profiles; compare garment_sizes via lib/fitLogic.js and ProductScreen/AskAISheet rules; show size only with enough data, then Linking.openURL to verified merchant product link. No checkout or payment handling.
- Wait/visible state: Estimated 1–3 s for catalog and sizing; show product preview and loading placeholder without freezing the outfit.
- Failure: Unknown size -> 'size not confirmed'; missing link -> unavailable state; no fabricated size or purchase.
- Cost per use: Existing catalog/search requests; SerpAPI credit only if web search is used; no checkout charges in V1.

```mermaid
flowchart TD
  suggest[Agent finds item] --> fit[Fit Profile and size chart]
  fit --> card[Show size or unknown]
  card --> link[Open merchant link]
  link --> finish[Checkout outside Stylit]
```

### 8. Mix & Match chip
**Pending owner review.**
- Trigger/screen: Tap Mix & Match on Stylist; show outfit combinations beneath the main image.
- Calls: Read permitted wardrobe/garments using `lib/garmentUtils.js` and `GET /api/garments`; rank combinations with `lib/styleEngine.ts`. Optional Try On uses only PR #4's gated path.
- Saved: Chosen items stay in local screen state; a generated image is saved server-only to owned `try_on_history`, not `garments`.
- Wait/visible state: Estimated 1–3 s for picks or 10–20 s for Try On; show cards while keeping the main image, then a progress message.
- Failure: No matching items -> offer manual choices; try-on failure -> retain old image with Retry.
- Cost per use: No new model charge for matching; one image-generation charge only if Try On runs (amount unverified).

```mermaid
flowchart TD
  chip[Mix and Match chip] --> read[Read owned wardrobe and garments]
  read --> rank[Rank combinations]
  rank --> select[User picks combination]
  select --> choose{Try On?}
  choose -->|No| cards[Show selected items]
  choose -->|Yes| tryon[PR4 gated try-on]
  tryon --> image[Show new saved image]
```

### 9. Color Analysis chip
**Pending owner review.**
- Trigger/screen: Tap Color Analysis; show an inline palette panel on Stylist.
- Calls: Read `profiles` color season via `lib/colorAnalysis.ts`. If absent, offer the existing `api/analyze-skin-tone/index.ts` face-analysis flow only with consent.
- Saved: A read saves nothing; existing profile color fields update only through the existing analysis path.
- Wait/visible state: Estimated 0.5–2 s for saved colors, 5–15 s if analysis requested; show palette or a progress state while outfit stays visible.
- Failure: Missing face image, permission or API -> show unknown season and existing profile setup option.
- Cost per use: Normal profile read; optional existing analysis may have unverified API charges.

```mermaid
flowchart TD
  chip[Color Analysis chip] --> exists{Season saved?}
  exists -->|Yes| show[Show season palette]
  exists -->|No| ask{Face analysis consent?}
  ask -->|No| setup[Offer profile setup]
  ask -->|Yes| analyse[Existing face analysis API]
  analyse --> profile[Existing profile fields]
  profile --> show
```

### 10. Style Advice chip
**Pending owner review.**
- Trigger/screen: Tap Style Advice; open a short panel on Stylist with current outfit still in view.
- Calls: Read `lib/styleEngine.ts` fingerprint and `profiles` color/Fit Profile; apply existing `lib/fitLogic.js` rules locally. A later Try On tap must reuse PR #4.
- Saved: Nothing by default; only explicitly provided preference/answer is written to the user's style profile with ownership checks.
- Wait/visible state: Estimated 0.5–2 s for local advice or 2–5 s when loading profile; show one short thinking message.
- Failure: Missing profile -> label it general advice; fetch error -> offer retry, never fabricate a score.
- Cost per use: Local rules have no model-call charge; regular Supabase usage only.

```mermaid
flowchart TD
  chip[Style Advice chip] --> signals[Read allowed style and fit signals]
  signals --> advice[Apply existing local rules]
  advice --> message[Show concise advice panel]
  message --> action{User asks for Try On?}
  action -->|No| done[Keep outfit]
  action -->|Yes| tryon[PR4 gated try-on]
```

## Task and PR merge order
0a. Add a short rules-only AGENTS.md to MVPStyli linking to the canonical vision.
0b. Install required PR-body vision-version CI check before implementation PRs.
1. Map Shop, garments, navigation and PR #4 collision paths.
2. Build Stylist shell with pinned chat and visual image area.
3. Apply verified owner mockup and Thanmayi theme/profile/wardrobe tokens (only after design access).
4. Wire chat intent, existing style signals and catalog sheet.
5. Add Elevate/Try On through PR #4, without changing PR #4 files.
6. Wire proactive suggestion and confirmed Pod creation.
7. Style my closet: enforce 3–4 photos, optional body photo, gated GPT-4.1 mini planner, three composed images via parallel PR #4 try-ons, private closet_items with RLS, optional profile question, swipe cards and Send to Pod.
8. Add opt-in, mocked nightly tomorrow look, permissions and Expo push path; do not enable production.
9. Show fit-aware find-and-buy links, not checkout.

## Notes
Workflow 1 and Workflow 2 have owner approval dated 2026-11-10. All remaining feature workflows are pending owner review; these workflow approvals do not authorize live/paid use or merge this studio PR.

Tasks 2 and 5 must not write `App.js` until MVPStyli PR #4 is merged; if PR #4 remains open, use an isolated implementation that does not modify any PR #4 changed files. Task 7 depends on PR #4 merged and must remain gated by `STYLIT_TRYON_TEST_ENABLED` until final go-live approval.

Every coding PR body must contain exactly `Vision version: v1` until the current version changes. CI must read the **current** exec.md on the studio default branch and fail missing, stale or unrecognized versions; never use archive/. When the owner changes the vision, copy the previous full exec.md text into dated archive file marked SUPERSEDED, update current exec.md with a new version/date, and adjust plans/checks. Coding chats must never read archive/.

Each task is one PR in MVPStyli. Every task defines read-only `uses` and writable `edits`. Follow its AGENTS.md merge rules; wait until a parent is proven on default branch; rebase later tasks in order and fix clashes. Never edit PR #4 files. Since PR #4 changes `App.js` and `screens/StyleVaultScreen.js`, any task that needs them waits for its merge and bases on top; do not race it. Never add secrets. Merging this planning PR is feature-start approval, **not** production/paid approval.
