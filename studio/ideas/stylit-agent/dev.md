# Dev: Stylit Agent

Status: proposed; all code later in killbill2792/MVPStyli

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
Times below are variable user experience expectations, not measured SLAs. Costs are per use: provider rates are not verified; no paid/live use is authorized by this plan.

### 1. Stylist chat turn
- Trigger/screen: User types or taps a quick chip in the pinned bar; Stylist stays on the same screen.
- Calls and save: Read allowed profile/color/fit/style signals via lib/styleEngine.ts and existing profile state; route intents locally to advice, existing search or Pod, with a safe short reply. No new paid model by default. Only save conversation if using existing chat_conversations/chat_messages with the user's ownership checks.
- Wait/visible state: Usually local/brief; show a short thinking line and keep image visible.
- Failure: Missing profile or network -> generic advice with retry; do not invent scores.
- Cost per use: Local rules: $0 marginal API; database requests billed under existing Supabase plan; optional model requires later approval.

```mermaid
flowchart TD
  chat[Type or chip] --> intent[Classify intent locally]\n  intent --> signals[Read style and profile]\n  signals --> reply[Short Stylist reply]\n  reply --> action[Update image or offer action]
```

### 2. Elevate / Try On
- Trigger/screen: Tap Try On on an Elevate item; outfit image remains visible.
- Calls and save: Resolve garment/image and current person photo; server calls PR #4's gated /api/tryon adapter -> Nano Banana -> server-owned image storage and try_on_history. App polls existing status and swaps the displayed image on success.
- Wait/visible state: Image generation time varies; keep prior image with progress and ask a style question.
- Failure: Missing photo, TEST gate, quota or failure -> preserve old image and offer retry; never write history client-side.
- Cost per use: Nano Banana provider charge per generation, amount unverified; storage and bandwidth extra. No call if gated.

```mermaid
flowchart TD
  tap[Try On] --> inputs[Check photo and garment]\n  inputs --> gated[PR4 gated try-on API]\n  gated --> model[Nano Banana via PR4 only]\n  model --> stored[Server stores image and history]\n  stored --> image[Swap outfit image]
```

### 3. Product catalog sheet
- Trigger/screen: Stylist says 'tap here to see products'; user taps the link on Stylist.
- Calls and save: For closet inventory use lib/garmentUtils.js -> GET /api/garments -> garments/garment_sizes; for web query use lib/productSearch.ts -> POST /api/searchwebproducts -> SerpAPI if configured. Normalize, cap near 10 and open a sheet. Try On hands product to existing try-on path.
- Wait/visible state: Show ten skeleton/placeholder slots while fetching; keep chat visible behind sheet.
- Failure: Missing products table or search key -> empty-state and retry or closet catalog; no fake stock.
- Cost per use: Garment fetch uses existing backend; web search consumes SerpAPI credits if enabled, price unverified; offline tests mock it.

```mermaid
flowchart TD
  open[Tap products link] --> source{Catalog or web?}\n  source -->|Catalog| garments[API garments]\n  source -->|Web| serp[Search API SerpAPI]\n  garments --> sheet[Ten-card sheet]\n  serp --> sheet\n  sheet --> tryon[Try On via PR4]
```

### 4. Proactive suggestion to Pod
- Trigger/screen: Stylist offers a reasoned look and asks 'Run a Pod? I'd go Global'; user says Yes.
- Calls and save: Get style fingerprint via lib/styleEngine.ts and image from existing try-on; on confirmation open existing createpod route in screens/PodsScreen.js, then lib/pods.ts createPod plus existing invites/votes/recap. Offer Global, friends or twins; no silent Pod creation.
- Wait/visible state: Immediate prompt; show progress while Pod saves, then existing timer/live route.
- Failure: No image, account or create error -> keep suggestion and explain; allow manual retry.
- Cost per use: No new model call; Supabase writes and storage under existing plan; votes add ordinary requests.

```mermaid
flowchart TD
  agent[Proactive suggestion] --> yes{User confirms?}\n  yes -->|No| stay[Keep look]\n  yes -->|Yes| create[Existing Pods create flow]\n  create --> live[Timer, votes, guest, recap]
```

### 5. Three looks from closet
- Trigger/screen: User adds 3–4 closet photos then taps More Looks.
- Calls and save: Use existing image picker/upload and garment/profile data; save user-owned closet references in a new scoped collection only if necessary. Construct closet, elevated and makeover prompts; send each image request sequentially through PR #4 gated try-on server path and existing history writes. Record look type and answers only with consent. Offer Send to Pod through existing createpod.
- Wait/visible state: Three generations can take longer; show each completed image as it arrives and ask a style question during the wait.
- Failure: Partial results remain; missing input/photo or gate -> explain and retry only unfinished looks. No client-side history insert.
- Cost per use: Up to 3 provider-billed generations, plus storage; exact price and latency unknown.

```mermaid
flowchart TD
  upload[Upload closet photos] --> plan[Build 3 look plans]\n  plan --> gen[PR4 try-on per look]\n  gen --> saved[Server stores images]\n  saved --> three[Show 3 images]\n  three --> pod[Send chosen look to Pod]
```

### 6. Tomorrow's look nightly
- Trigger/screen: User opts in; existing Vercel scheduled job runs nightly in the user's time zone.
- Calls and save: Scheduled Vercel function verifies auth/ownership and opt-in in Supabase, reads private closet, approved calendar event and consented location/weather, builds candidate look, calls PR #4 image service if enabled, stores user-owned result and delivery state, sends Expo push with image/link. No external bot. Nightly service and push go live only after owner approval.
- Wait/visible state: Background scheduled work; user sees delivery status in app and next day's image when ready, not a spinner.
- Failure: No permissions/data, weather failure, job retry or Expo push failure -> skip or show safe closet-only suggestion; dedupe sends; never leak calendar/location.
- Cost per use: Potential image generation per opted-in user/night + weather/API + Vercel/Supabase + Expo push; prices unverified; disabled until go-live gate.

```mermaid
flowchart TD
  cron[Nightly Vercel cron] --> consent[Check opt-in and user TZ]\n  consent --> sources[Closet calendar weather]\n  sources --> image[PR4 image path if gated on]\n  image --> save[Store owned result and dedupe]\n  save --> push[Expo push with image]
```

### 7. Find and buy
- Trigger/screen: Stylist proactively offers a product; user taps Shop this item.
- Calls and save: Use existing search/catalog and Fit Profile measurements in profiles; compare garment_sizes via lib/fitLogic.js and ProductScreen/AskAISheet rules; show size only with enough data, then Linking.openURL to verified merchant product link. No checkout or payment handling.
- Wait/visible state: Short catalog lookup; show product preview and loading placeholder, never freeze the outfit.
- Failure: Unknown size -> 'size not confirmed'; missing link -> unavailable state; no fabricated size or purchase.
- Cost per use: Existing catalog/search requests; SerpAPI credit only if web search is used; no checkout charges in V1.

```mermaid
flowchart TD
  suggest[Agent finds item] --> fit[Fit Profile and size chart]\n  fit --> card[Show size or unknown]\n  card --> link[Open merchant link]\n  link --> end[Checkout outside Stylit]
```

## Task and PR merge order
1. Map Shop, garments, navigation and PR #4 collision paths.
2. Build Stylist shell with pinned chat and visual image area.
3. Apply verified owner mockup and Thanmayi theme/profile/wardrobe tokens (only after design access).
4. Wire chat intent, existing style signals and catalog sheet.
5. Add Elevate/Try On through PR #4, without changing PR #4 files.
6. Wire proactive suggestion and confirmed Pod creation.
7. Add closet uploads, three looks, style question and Send to Pod.
8. Add opt-in, mocked nightly tomorrow look, permissions and Expo push path; do not enable production.
9. Show fit-aware find-and-buy links, not checkout.

## Notes
Each task is one PR in MVPStyli. Every task defines read-only `uses` and writable `edits`. Follow its AGENTS.md merge rules; wait until a parent is proven on default branch; rebase later tasks in order and fix clashes. Never edit PR #4 files. Since PR #4 changes `App.js` and `screens/StyleVaultScreen.js`, any task that needs them waits for its merge and bases on top; do not race it. Never add secrets. Merging this planning PR is feature-start approval, **not** production/paid approval.
