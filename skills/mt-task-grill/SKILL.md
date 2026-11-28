---
name: mt-task-grill
description: Use when the user has a draft task plan and wants it sharpened, completed, and approved before execution.
---

# Grill a task plan

Warm up a draft plan until it is complete and approved. The calling agent
does recon and writes the draft; this skill interrogates it. Decisions are
the user's; never invent requirements. The plan file is `./.plan.md`.

## Input

A markdown plan: a `# Plan: <run-id>` header with a `Status:` line, then one
block per task (blocks, not a table — test commands may contain pipes):

    ## Task <id>: <title>
    branch: <name>
    deps: <ids or —>
    files: <exact paths, comma-separated>
    test: <one exact shell command>
    model: <provider/model or —>
    interfaces: <exact names/signatures consumed from deps, or —>

    <brief: what to build, behavior, exact values, out of scope>

## Interview in rounds

Work the plan as a design tree. Each round ask the whole frontier — every
gap whose prerequisites are settled — numbered, each with a recommended
answer worded so "yes" accepts it; wait for the user before the next round.
Facts (file existence, command runnability, RED at base) you check yourself;
decisions you put to the user. Rounds end only when the frontier is empty
and every task passes the checklist — nothing silently assumed. Present the
plan for approval only then.

## Check every task

- Brief: behavior and exact values present; out of scope stated; no ambiguity
  left for the executor to guess.
- Files: exact paths, no directories; modify targets exist in the repo.
- Test: one exact shell command. Run each new test at the base yourself: it
  must fail (expected RED); a test that already passes is a finding — rewrite
  it. An existing test file must run.
- Deps: acyclic; a file shared by two tasks requires a dependency path.
- Interfaces: a task consuming another's output carries the exact
  names/signatures it consumes; they match the producer's brief.
- Granularity: a vertical slice with its own test cycle, sized for one fresh
  context. A wide mechanical refactor is the exception: sequence it
  expand → migrate batches → contract, each batch its own task.
- Model: assign a tier — mechanical 1–2-file tasks with exact values → cheap;
  prose briefs and integration → mid-tier floor; design/judgment → most
  capable. An omitted model inherits the session model, often the dearest.

## Self-review before approval

Every requirement of the request maps to a task; every brief line decides
something the executor cannot decide alone. In the final round ask: does
every dep edge genuinely gate the task, or only order it? Propose removing
ordering-only edges (the shared-file rule still stands).

## Approve and write

1. Present the completed plan and the resolved decisions.
2. Ensure `./.plan.md` is git-ignored: `git check-ignore .plan.md`; if not,
   append `.plan.md` to `.git/info/exclude` (local, never committed).
3. Write `./.plan.md` only after the user approves the exact text.
4. Set the header line `Status: approved`. mt-task-execute refuses plans
   without it.

Report the plan path and tell the user to run mt-task-execute.