# Studio

See [Studio knowledge](studio/KNOWLEDGE.md).

Reusable templates for product work.

The root `.github/` folder contains copyable PR safety checks. Copy it into new product repositories and update the repository name in `.github/pull_request_template.md`. Replace the landing workflow's template smoke command with the product's **existing** fast test/build/smoke command (target under 60 seconds). Do not mark either workflow as required in branch protection. The PR marker check warns when a marker is absent and fails only for a real repository mismatch; the landing check runs after merge and comments on the merged PR only if the smoke command fails.

## Repository authority

The dispatcher should resolve each task's `repo` from its approved task ledger/`tasks.json` entry, **not** from text written by a coding chat. The task template therefore includes `repo: <owner>/<repository>`. An explicit PR-body `<!-- repo: owner/name task: id -->` is an optional warning/fail diagnostic: missing is a warning only; a stated but wrong repo is a real failure. Keep check failures routed through the existing dispatcher/Muse/original-PR-chat loop. The template intentionally does not install a second dispatcher or any new required check.

The copied PR template intentionally uses a **nonmatching placeholder marker**. It produces a warning, never a false mismatch, until an authorized task/PR creator substitutes the real repository and task. Do not use an example `studio` marker as the default in every copied product repository.
