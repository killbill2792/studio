<!-- repo: <owner>/<repository> task: <task-id> -->
<!-- Optional: aicafe-chat-url https://chatgpt.com/c/real-chat-id -->

## Change
Describe the scoped change and tests.

## Safety checks
- PR repository marker: runs beside existing CI, warns if absent, fails only when the claimed repository differs.
- Landing check: runs only after a push to main, records PR/SHA/repo/result/chat URL, comments on merged PR once only on a failing smoke test.
- Neither check adds a required gate, label, human step, or merge wait. A real wrong-repository mismatch is the only intentional PR failure from the marker check.
