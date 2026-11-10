# Decision: Stylit Agent

## Current vision
[exec.md — v1](https://github.com/killbill2792/studio/blob/main/studio/ideas/stylit-agent/exec.md) is the only current vision. This decision file records gates and constraints, not the vision text.

## Handoff
- Goal: Follow current exec.md. Do not restate vision here.
- Status: proposed; no app code changed.
- Owner decision: Workflow 1 (Stylist screen) **Approved by owner 2026-11-10, 10:18 AM PT**; Workflow 2 (Style my closet + three looks) **Approved by owner 2026-11-10, 10:22 AM PT**; Workflow 3 (tomorrow's look) **Approved by owner 2026-11-10, 10:36 AM PT**. Other workflows pending owner review. Vision stays v1. **Merge of this studio PR is the separate feature-start approval**; do not merge automatically.
- Why: Owner's direction is recorded only in current exec.md.
- Merge order: tasks 0a, 0b, 1–9; follow AGENTS.md and prove each parent before merging a child.
- Code repo: killbill2792/MVPStyli only. This studio PR holds plans only.

```mermaid
flowchart TD
  start[Map Shop and data] --> shell[Stylist shell]
  shell --> design[Apply verified design]
  design --> chat[Chat and catalog]
  chat --> tryon[Elevate through existing try-on]
  tryon --> pod[Proactive Pod]
  pod --> looks[Three looks]
  looks --> tomorrow[Nightly look]
  tomorrow --> buy[Sized store link]
```

## Workflow 2 locked requirements
- Entry: Stylist **Style my closet**; exactly 3–4 clothing photos; require `profiles.body_image_url` full-body image first; generate immediately, without repurposing More Looks.
- Server-side **OpenAI GPT-4.1 mini on Vercel** plans Closet (uploaded pieces only), Elevated (uploaded base plus 1–2 catalog pieces), and Makeover (new style). An optional question is asked during generation; save answers to the style profile and use timely answers for this run, late answers for the next; skip never blocks generation.
- A separate server compositor makes one garment image per outfit, then starts three **parallel** PR #4-gated Nano Banana image jobs. Do not edit PR #4. Rough estimate **20–30 s for images**, plus uploads/planning/composition; **1 LLM call and 3 image generations per run**, costs unverified and not yet authorized.
- New private `closet_items` table with user_id, per-user private storage image_path, type, color, created_at; RLS/storage isolation. Never mix with `garments`. PR #4 server-only `try_on_history` records each successful image.
- Three swipe cards under main image; tap to promote; each Send to Pod suggests Global. Partial failure shows the other looks and Retry on the failed card.
- Task 7 requires PR #4 merged and `STYLIT_TRYON_TEST_ENABLED` until go-live approval. Tasks 2/5 cannot edit `App.js` before PR #4 merge; otherwise avoid it and all PR #4 files.

## Workflow 3 locked requirements
- Hourly **Supabase pg_cron** selects opted-in users whose saved IANA time zone is at 21:00 local and who were active in the last 7 days; dispatch **one job per user** to the app's Vercel backend. Respect its **30 s limit**; never one long batch. The device saves `profiles.timezone` and `profiles.city` at sign-in.
- Weather is **Open-Meteo free forecast for testing only**; commercial use/provider choice needs owner's go-live OK. Events come from Stylist disclosures and opt-in **expo-calendar** titles/times synced privately at the last app open.
- Reuse Workflow 2's **server LLM picker** for one look and its multi-piece image composer, then **only PR #4 Nano Banana path**. One retry, then skip night. No Dave/external bots.
- Private `tomorrow_looks` with unique `(user_id, local_date)`, look items, image path, weather, event and status; per-device Expo tokens; in-app notification and **server-only** `try_on_history`. RLS/ownership and idempotency required.
- Text-only Expo push: **“Tomorrow's look is ready.”** iOS image-in-notification needs a Notification Service Extension and owner go-live approval.
- Opening push/in-app row shows the look as Stylist main photo, short reason, Wear it / Show me more / Send to Pod (Global suggested). No closet -> invite three photos; no body photo -> request one; denied push -> keep look in-app; generation error -> retry once then skip.
- **Estimated $0.04–$0.06 per eligible active user/night**, unverified. Task 8 requires **MVPStyli PR #4 merged, PR #4 history SQL applied, and task 7 closet_items/composition proven**. Entire workflow stays dark/mock until final go-live approval.

## Do not break
- No vision drift: v1 is only in current exec.md. On owner-approved changes, archive the old text under archive/ marked SUPERSEDED and never read archive/ in coding chats. Every coding PR must state its vision version; CI rejects mismatch with the current exec.md version. MVPStyli AGENTS.md must contain rules and a link only, no copied vision.
- Lakshmi7580's open [MVPStyli PR #4](https://github.com/killbill2792/MVPStyli/pull/4): gated Nano Banana try-on; **only** its code path may call the image model. Reuse it; never edit its files. If it merges first, base subsequent app branches on top; otherwise wait for it or avoid all changed files, including shared `App.js` and `screens/StyleVaultScreen.js`.
- Preserve server-only `try_on_history` writes, ownership checks on deletes, storage/image ownership, missing-`products` handling, and unapplied `scripts/migrations/20261031_server_only_try_on_history_writes.sql`. Do not assume SQL has run or bypass its guards. No direct client history writes.
- Preserve Pods (friends/twins/global, timing, voting, recaps, guest votes and invites), profiles/StyleVault, wardrobe, Fit Profile, Fit Check and other navigation.
- Task 1 must inventory Shop's `fetchGarmentsAsProducts` -> `/api/garments` -> `garments` and `garment_sizes` dependencies before removing Shop UI. Do not delete product detail or shared garment code.
- No production, App Store, paid API, live checkout, secret, or scheduled push enablement without final owner go-live OK. Use mocks/test fences while building.

## Exec view
Refer only to current [exec.md](https://github.com/killbill2792/studio/blob/main/studio/ideas/stylit-agent/exec.md).

## Product view
Refer to product.md for implementation details, not a second vision.

## Dev view
Use small isolated adapters and CI checks. First add rules-only MVPStyli AGENTS.md and enforce a PR-body current-version check.

## Marketing view
Wait until merged and proven; Claude Medium writes and Muse posts.

## Open questions
- Owner mockup and Thanmayi's Nov 4 Figma wireframes (Trello tz4sewiZ) could not be opened; do not guess colors or layouts. Obtain them before design task.
- Verify PR #4 merge and SQL deployment status before any try-on feature.
- Workflow 3 chose on-device expo-calendar opt-in, IANA time zone and city, and text-only push. Validate provider commercial rights, permissions, Vercel timing and actual costs before go-live; image-in-notification is a separate owner decision.
- Studio KNOWLEDGE.md leaves D7, D8 and D9 undecided; do not invent rulings.

## Lessons
Coding chats append what broke, what later tasks need to know and the fix.
