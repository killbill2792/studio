# Studio public decision ledger

- **Owner/Muse read-only URL (after GitHub Pages is enabled for `main /docs`):** `https://killbill2792.github.io/studio/ledger/`.
- **Canonical machine-readable record:** `https://raw.githubusercontent.com/killbill2792/studio/main/docs/ledger/ledger.json` (Muse can read without rendering JavaScript).
- **Authority:** `studio/ideas/stylit-agent/exec.md`, `decision.md`, `tasks.json`. The public ledger is a **presentation/index**, not a second scheduler or approval ledger.
- PR state is checked from GitHub when the web page loads. If API lookups fail or rate-limit, status is explicitly **unknown**. Never infer merged/integration-proven from a stale webpage.
- To update decisions, submit a Studio decision/amendment PR modifying source-of-truth files plus `ledger.json` in the same PR. Review, owner merge, then Muse may read the new main record.
- GitHub Pages is public. **Never** include GitHub tokens, private dispatcher receipts, owner messages, raw chat URLs or personal data in `ledger.json`.
- To publish: in Studio repo Settings → Pages, select **Deploy from a branch**, branch `main`, folder `/docs`. This must be enabled by the owner if not already configured; a PR alone does not activate hosting.
- Do not let GitHub Pages status start tasks. A new Studio chat compares live GitHub PRs, records a decision and owner-approved task release; scope changes follow the Studio amendment process.
