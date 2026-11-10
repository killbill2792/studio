# Studio

Reusable templates for product work.

The root \`.github/\` folder contains copyable PR safety checks. Copy it into new product repositories and update the repository name in \`.github/pull_request_template.md\`. Replace the landing workflow's template smoke command with the product's **existing** fast test/build/smoke command (target under 60 seconds). Do not mark either workflow as required in branch protection. The PR marker check warns when a marker is absent and fails only for a real repository mismatch; the landing check runs after merge and comments on the merged PR only if the smoke command fails.
