---
name: mt-task-execute
description: Use when the user asks to launch or run an approved task plan.
---

# Execute a plan in parallel worktree agents

Launch the ready wave of a task plan: one herdr worktree workspace and one
fresh opencode agent per task. Recon and planning happen before this skill;
never invent tasks here. The plan file is `./.plan.md`.

## Gates

- Run `test "${HERDR_ENV:-}" = 1`. If it fails, say you are outside herdr and stop.
- The plan must carry `Status: approved` (set by mt-task-grill). A raw draft →
  refuse and point to mt-task-grill.
- `herdr --skill` is the authority for exact agent/pane flags; the installed
  binary wins over memory. Read identifiers only from JSON responses, never
  from sidebar order.
- Read `./.plan.md` in the shape mt-task-grill writes (header `# Plan:
  <run-id>`, one block per task: branch, deps, files, test, model, interfaces,
  brief). `files` are exact paths; directories are forbidden.
- `git check-ignore .plan.md` must pass (mt-task-grill ensures it); if not,
  stop and point to mt-task-grill.

## Validate the whole plan

Refuse the entire plan and ask for a rewrite when:

- a task id or branch repeats;
- `deps` contain a cycle or an unknown id;
- a file path appears in two tasks without a dependency path between them;
- a row lacks files, test, or a brief block;
- a branch already exists, or the agent name is already live (`herdr agent list`).

Semantic preflight: for each dep edge compare the producer's brief against
the consumer's — names, signatures, exact values. A contradiction → refuse.

## Launch the ready wave

A task is ready when all its deps are clean (zero review findings). At
launch time only tasks with `deps: —` are ready.

1. Set run-id from the plan header. Agent name and worktree label:
   `<run-id>-<id>`, max 32 chars of `[a-z0-9_-]`; truncate run-id to fit.
2. Create the run branch and switch to it: read branch naming rules from
   `CONTRIBUTING.md` / `AGENTS.md`; none documented → ask the user for a
   format. Propose a name (e.g. `feat/<run-id>`), get approval of the exact
   name. Detached HEAD → stop. Name exists → propose another. Dirty caller
   tree → warn that uncommitted changes carry over. After approval run
   `git -C <repo> switch -c <run-branch>` and verify with `git status -sb`.
3. Record the base: `git -C <repo> rev-parse HEAD` (the run branch head).
4. For each ready task:
   - `herdr worktree create --cwd <repo> --branch <branch> --base <base-sha> --label <name> --no-focus`
   - Parse the workspace id and root pane id from the JSON response.
   - `git status --short` in the caller repo must not list the new worktree;
     if it does, stop and report.
   - Run the repo's documented setup in the worktree if any, then run `<test>`
     at base: expected RED for a new test; any other failure → stop and report
     before launching.
   - Apply the `model` column (see Model selection).
   - `herdr agent start <name> --kind opencode --pane <pane-id> --timeout 60000 -- --auto`
   - If startup returns `agent_not_ready`, wait for idle before prompting.
   - `herdr agent prompt <name> "<prompt>" --wait --timeout 10000`.
     `timeout` → delivered and working (the normal case); a settled state →
     fast completion; `agent_prompt_stalled` → not delivered, report the task
     as not started; `agent_blocked` → report the dialog, do not answer it.
5. On any failure stop immediately; report the table of what was created plus
   the exact error. No automatic rollback.

## Model selection

Apply the plan's `model` value by agent kind before `agent start`:

- opencode (the launch kind): write `{"model": "<model>"}` to
  `<worktree-path>/opencode.json`. mt-task-complete deletes this file before
  teardown. The TUI rejects a `--model` flag; the worktree config is the
  verified mechanism. When the worktree has a git remote, add `permissions`
  deny rules (push, merge, destructive shell) to the same file: `--auto` is
  prompt-level isolation, not a sandbox.
- codex: `-m <model>` after `--` — reference only; execute launches opencode
  today and has no kind field.

Absent or `—` → session default (grill assigns the tier). Record the requested
model (or `default`) in the run table.

## Executor prompt recipe

Assemble exactly these parts, in order:

1. One line: task `<id>` of run `<run-id>`; this worktree is your entire world.
2. The task's brief block, verbatim.
3. Interfaces your deps produced: exact names/signatures (from their briefs
   and commits). Reading those dep-produced symbols is allowed.
4. Files: the exact paths from the row. Touch no other file.
5. Test: run `<test>` and make it pass.
6. Boundaries: no commit, no merge, no push, no subagents, no repo exploration
   beyond the listed files and dep-produced symbols; stop and report if the
   brief is ambiguous.
7. Report contract: final message under 15 lines —
   `Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT`, one
   test-summary line, concerns if any. BLOCKED/NEEDS_CONTEXT: name what you
   tried and what you need.

## Return

Report the run table: run branch, plan path, task id, title, workspace_id,
branch, pane_id, agent name, model, base SHA, status (launched /
waiting-for-deps). Tell the user to run mt-task-complete to monitor, review,
and advance waves.