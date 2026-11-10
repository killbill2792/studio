# Decision: Stylit Agent

## Current vision
[exec.md — v1](https://github.com/killbill2792/studio/blob/main/studio/ideas/stylit-agent/exec.md) is the only current vision. This decision file records gates and constraints, not the vision text.

## Handoff
- Goal: Follow current exec.md. Do not restate vision here.
- Status: proposed; no app code changed.
- Owner decision: Vision and workflow brief accepted for proposal; **merge of this studio PR is the separate feature-start approval**. Do not merge automatically.
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
- Nightly calendar source, permissions, time zone, weather provider, image push support and real provider costs need test-environment validation.
- Studio KNOWLEDGE.md leaves D7, D8 and D9 undecided; do not invent rulings.

## Lessons
Coding chats append what broke, what later tasks need to know and the fix.
