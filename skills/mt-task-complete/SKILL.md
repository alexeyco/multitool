---
name: mt-task-complete
description: Use when launched run agents need monitoring, verification, or wave advancement.
---

# Complete a launched run

Monitor the run launched by mt-task-execute, verify and commit finished
tasks, run mt-task-review, launch dependent waves, and tear down. Work on
the full run or a subset of task ids the user names.

## Gates

- Run `test "${HERDR_ENV:-}" = 1`, else stop. Read IDs only from JSON responses.
- Read `./.plan.md` for each task's files, test, brief, and interfaces.
- Reconstruct the run table: `herdr worktree list --cwd <repo>` and
  `herdr agent list`, matched by agent name / label `<run-id>-<id>`.
  Base SHA comes from the execute table; resuming without it, use
  `git merge-base <caller-branch> <task-branch>` per task. If the caller
  branch has commits after the run base, ask the user for the base.
- Resume rule: a task branch with commits ahead of its base is implemented —
  never re-launch its executor; resume at verify/review. Emit one completion
  line per task at commit time (id, base..head, test → result) and re-emit
  the full run table after every state change.

## Wait and classify

Wait in bounded stretches (≤5 min); between stretches post one status line
and reconcile all live agents (`herdr agent list`) before waiting again.
Never let one stuck task block the others.

- settled idle/done → read the report (`herdr agent read <name> --source
  recent-unwrapped`), parse `Status:`.
- blocked → «ждёт человека»: inspect `agent get` / `agent read`, report the
  dialog, do not answer it yourself.
- timeout → «залип»; agent missing or pane exited → «ошибка».
- unknown → read the pane and report; never treat it as completion.

Report status branches:

- DONE → verify.
- DONE_WITH_CONCERNS: correctness/scope concerns → resolve before review;
  observations → note, proceed.
- NEEDS_CONTEXT → supply the missing context, re-prompt.
- BLOCKED → change something (context, model, or split) before retry; never
  retry unchanged.

## Verify, then commit

Run the row's `test` command in the worktree yourself; read the full output.
The agent's report is not evidence.

- Uncommitted executor work: `git -C <worktree-path> status --short` — the
  dirty set must equal the row's files (plus the untracked opencode.json).
  Any other modified file → do not commit; report the breach and ask the
  user (revert it, move it to a new task, or expand the row). Green and
  dirty-set matches → `git add <exact files>` and
  `git commit -m "<id>: <title>"`; record the head SHA. Red → «ошибка»,
  leave uncommitted, report.
- Already-committed task (resume): worktree clean and branch ahead of base →
  skip the dirty-set gate; green → proceed to review, red → «ошибка».

Then run mt-task-review for the task; it loops until clean, max 3 passes.

## Advance waves

When a task becomes clean, every dependent task whose deps are all clean is
now ready. One dep → `--base <dep-branch-tip>` (its head after the final
commit). Several deps → create from the first dep's tip, merge the other dep
branches into it with an orchestrator commit, run each dep's test command on
the merged base (red → stop before launching), and record that head as the
task's base. Then launch and prompt as mt-task-execute does, reusing the
existing run branch (create no new run branch). Repeat until every task is
terminal.

## Summarize and tear down

Report per task: status, commit SHA, test result, review passes, findings,
and `git diff <base>..<branch> --stat`. List every orchestrator decision
(fallback base, multi-dep merge order, early stops) with what it costs if
wrong. Then teardown, per task: first delete the execute-created
`opencode.json` when it is untracked (never a tracked file), then:

- clean worktree (no modified tracked files, no untracked files except the
  execute-created opencode.json) or merged → `herdr worktree remove --workspace <id>`;
- dirty worktree → offer commit-to-branch / move-to-caller / delete. Deletion
  requires the user to type exactly `discard` as the whole message, per
  worktree; only then `--force`. Never force on your own initiative.

Branches always survive removal. Never close the caller's source workspace.
Hand the run table to mt-task-ship.