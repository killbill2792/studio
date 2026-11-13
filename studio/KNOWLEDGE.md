# Studio knowledge

This file is the front door. Any agent (ChatGPT, Grok Bot, or a later one) reads and updates it. A chat is only a window into this record.

## How an idea moves

1. The owner brings an idea in this product's Studio chat.
2. Exec and Product brainstorm. Dev plans the architecture (Mermaid) and writes `tasks.json`.
3. The chat records the owner's OK in `decision.md` and opens a decision PR.
4. The owner taps Merge. Studio chat explicitly selects and releases each approved coding task; one ChatGPT coding chat per task, Codex review when ready, referee for routine questions. A dispatcher may track and repair approved work but never independently decide which task or decision step starts.
5. After the feature is merged and proven, Marketing drafts, Claude Medium writes, Muse posts. After a step finishes, the owner can open **any new Studio chat** and ask what comes next; the chat reads the current decision board, task plan and live GitHub status rather than relying on a prior conversation.

## Paths

- This file: `studio/KNOWLEDGE.md`
- An idea: `studio/<product>/ideas/<idea>/` — `exec.md`, `product.md`, `dev.md`, `marketing.md`, `decision.md`, `tasks.json`
- Copy idea files from `studio/templates/idea/`
- Personas: `studio/templates/personas/`
- Step-by-step decision boards: `studio/<product>/ideas/<idea>/decision-board.md` or the matching existing idea path; each board links decision questions, answers, PRs and dependencies. Separate role chats can contribute, but Studio consolidates one record.

## Locked rules

- Approval is the owner's chat OK, written into `decision.md`, plus Merge on the decision PR. **A dependency becoming ready is not permission to start a new task:** Studio chat chooses and records each task release.
- Ask the owner only for a new goal, a new architecture, paid or live work, or secrets. File clashes and rule questions go to the referee, or are already decided by merge order.
- Parallel tasks may edit shared files. They merge in order. The later PR rebases onto the recorded parent SHA and fixes clashes itself.
- Do not squash-merge a parent while child PRs are still open.
- "Merged" is not "proven." A child waits until the parent is proven on the default branch.
- Adding a read-only `uses` note must not cancel a live approval.
- Coding chats append lessons to `decision.md`.
- For every idea, the **only current vision** lives in its `exec.md` with `Vision version: vN, date: YYYY-MM-DD` at the top. Other idea files link to it; never duplicate vision text.
- When an owner changes a vision, mark its prior complete version `SUPERSEDED` and move it under that idea's `archive/`; update the current `exec.md` version and date. Coding chats **never read `archive/`**.
- Every coding PR body states `Vision version: vN`. A required CI check compares that version with the version in the current studio `exec.md` on default branch, and fails missing or stale versions.
- Each coding repository keeps one short rules-only `AGENTS.md` linking to the canonical studio vision; it must not copy or paraphrase vision text. Coding chats follow that link, not archive/.

## Products

- Stylit: `studio/ideas/stylit-agent/` (existing canonical idea path).

## Open decisions

D7 (safety net), D8, and D9 are not decided yet. Do not invent them.
