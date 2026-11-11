'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { selectMergedPr } = require('./landing-receipt.cjs');
const { parseRepoMarker, parseChatUrl, validateRepo } = require('./pr-markers.cjs');

test('matching repository and task pass', () => {
  assert.deepEqual(parseRepoMarker('note\n<!-- repo: killbill2792/studio task: SAFETY-1 -->'), {
    repo: 'killbill2792/studio', task: 'SAFETY-1', ambiguous: false
  });
  assert.equal(validateRepo('<!-- repo: killbill2792/studio task: 42 -->', 'killbill2792/studio').status, 'success');
});
test('mismatch fails with both repository names', () => {
  assert.deepEqual(validateRepo('<!-- repo: killbill2792/aicafe task: 42 -->', 'killbill2792/studio'), {
    status: 'failure', message: 'This PR says it belongs to killbill2792/aicafe but is in killbill2792/studio'
  });
});
test('missing or incomplete marker only warns', () => {
  for (const body of ['', 'ordinary Dependabot PR', '<!-- repo: owner/repo -->', '<!-- repo: <owner>/<repository> task: <task-id> -->']) {
    assert.equal(validateRepo(body, 'owner/repo').status, 'warning');
  }
});
test('conflicting markers fail rather than accepting the first one', () => {
  assert.equal(validateRepo('<!-- repo: a/b task: 1 -->\n<!-- repo: c/d task: 2 -->', 'a/b').status, 'failure');
});
test('extracts optional real chat URL and rejects unrelated URLs', () => {
  assert.equal(parseChatUrl('<!-- aicafe-chat-url https://chatgpt.com/c/abc-123 -->'), 'https://chatgpt.com/c/abc-123');
  assert.equal(parseChatUrl('<!-- aicafe-chat-url https://chatgpt.com/g/project/c/abc -->'), 'https://chatgpt.com/g/project/c/abc');
  assert.equal(parseChatUrl('<!-- aicafe-chat-url https://evil.example/x -->'), null);
});

test('failed smoke exits nonzero before an always-run receipt can report it', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../workflows/landing-check.yml'), 'utf8');
  const smoke = workflow.split('name: Run repository smoke command')[1]?.split('name: Write receipt')[0];
  assert.ok(smoke, 'landing smoke and receipt steps must exist');
  assert.match(smoke, /echo "exit_code=\$result" >> "\$GITHUB_OUTPUT"/);
  assert.match(smoke, /exit "\$result"/);
  assert.match(workflow, /name: Write receipt and report only real failures\s+if: \$\{\{ always\(\)/);
});

test('direct pushes cannot attribute a failing landing check to an unrelated merged PR', () => {
  const pr = { number: 17, merged_at: '2026-11-10T18:00:00Z', base: { ref: 'main' }, merge_commit_sha: 'merged-pr-sha' };
  assert.equal(selectMergedPr([pr], 'unrelated-direct-push-sha'), null);
  assert.equal(selectMergedPr([pr], 'merged-pr-sha'), pr);
  assert.equal(selectMergedPr([{ ...pr, merged_at: null }], 'merged-pr-sha'), null);
  assert.equal(selectMergedPr([{ ...pr, base: { ref: 'other' } }], 'merged-pr-sha'), null);
});

test('dispatch verifies a main ancestor using authenticated checkout, without a second fetch', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../workflows/landing-check.yml'), 'utf8');
  const checkout = workflow.split('- uses: actions/checkout@v4')[1]?.split('- name: Verify')[0];
  const verify = workflow.split('- name: Verify and select merged main commit')[1]?.split('- name: Run repository smoke')[0];
  assert.ok(checkout && verify, 'checkout and verification steps are present');
  assert.match(checkout, /persist-credentials: false/);
  assert.match(checkout, /fetch-depth: 0/);
  assert.match(checkout, /ref: \$\{\{ github\.event_name == 'workflow_dispatch' && 'main' \\|\\| github\.sha \}\}/);
  assert.doesNotMatch(verify, /\\bgit fetch\\b/);
  assert.match(verify, /git merge-base --is-ancestor "\\$TARGET_SHA" HEAD/);
  assert.match(verify, /git checkout --detach "\\$TARGET_SHA"/);
});
