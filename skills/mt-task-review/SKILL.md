---
name: mt-task-review
description: Use when a committed task needs its review gate before the run advances.
---

# Review a task with a fresh herdr agent

One reviewer per pass, fresh context, read-only. Called by mt-task-complete
after a task's commit; reviewers for several tasks may run in parallel.

## Gates

- Run `test "${HERDR_ENV:-}" = 1`, else stop. Read IDs only from JSON responses.
- Inputs from the run table: task id, brief, worktree path, task pane id,
  base SHA, head SHA, pass number, prior findings.

## Run one review pass

1. `herdr pane split --pane <task-pane-id> --direction right --cwd <worktree-path> --no-focus`;
   parse the new pane id from the JSON response.
2. `herdr agent start <name> --kind opencode --pane <new-pane-id> --timeout 60000 -- --auto`
   (name as mt-task-execute does plus `-rev<pass>`; truncate run-id so the full
   name fits 32 chars of `[a-z0-9_-]`). The reviewer inherits
   the worktree model by default; the orchestrator may override it for a pass
   via the same opencode.json mechanism (cheap-to-mid tier for scoped
   re-reviews of small fix diffs).
3. Prompt recipe, in order: one line of context (reviewer of task `<id>`,
   read-only); the brief verbatim; the repo's documented standards
   (AGENTS.md / CONTRIBUTING.md); the evidence commands `git diff <base>..<head>`
   and the row's test command. Contract: inspect the diff and the listed
   files; the orchestrator already ran the test on this exact tree — run it
   only for a specific doubt the existing output cannot answer; change
   nothing, no commit/merge/push, no subagents. Two verdicts required, under
   400 words total:
   - Spec: missing / extra / misunderstood vs the brief, `file:line` each.
   - Quality: findings by severity (Critical / Important / Minor), lens = the
     repo's documented standards, `file:line` + fix suggestion each.
   CLEAN only when spec-compliant and zero Critical/Important findings.
4. `herdr agent wait <name> --timeout 900000`, then
   `herdr agent read <name> --source recent-unwrapped`; parse both verdicts.
5. `herdr pane close <new-pane-id>`.

Pass N>1 is scoped: review only `prev-head..new-head`; verdict each prior
finding ADDRESSED / NOT ADDRESSED and flag new breakage in the fix diff only.
Observations on untouched code (not findings against the diff) go to the
final report as deferred; they never extend the loop.

## Fix loop

- CLEAN with no Minor findings → task clean; return.
- Minor findings are present (with or without a CLEAN verdict) → ask the user
  whether to continue fixing or accept; do not loop or defer without the
  user's choice. The reviewer's severity label is final: Minor findings are
  findings, not observations — reclassification is not allowed.
- Critical/Important and pass < 3 → send the findings verbatim to the
  executor (`herdr agent prompt <executor> "Fix these findings, keep all
  boundaries: ..."`). A finding that contradicts the brief goes to the
  orchestrator for a ruling (recorded in the run table, surfaced to the user)
  instead of a silent override. Wait, re-run the test. Green → commit the fix
  (`git add <exact files>`, `git commit -m "<id>: review fixes (pass N)"`),
  update head SHA, next pass. Red → do not commit; carry into the next pass.
- The same finding open after two fix passes → stop early to the user, or
  make the last attempt on a more capable model (rewrite opencode.json).
  Never retry unchanged.
- Pass 3 still dirty → stop; return findings to mt-task-complete; the task
  goes to the user as «ждёт человека». Never start a fourth pass.

Return to mt-task-complete: pass count, both verdicts, user-accepted deferred
Minor, head SHA.