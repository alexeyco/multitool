---
name: mt-task-reflect
description: Use when a run has been shipped and the user wants a retrospective of the current orchestration session.
---

# Retro the current session

Retrospect this orchestrator session only: the plan, launch decisions,
waits, review loops, merges, and teardown visible in this chat. No files, no
journals, no changes — findings and suggestions in chat; the human decides.

## Sources

Read back through the current session: the run table, status transitions,
stuck/blocked episodes, review passes and findings, test failures, plan
rewrites, confirmations. Do not call herdr; the panes may already be gone.

## Findings

Produce candidates ordered by severity, each with: what happened (evidence
from this session), why it cost time or tokens, and a concrete improvement.
Look at:

- Plan quality: missing briefs, wrong file lists, overlaps, deps that should
  have been split or merged.
- Executor boundaries: prompts that let agents wander, reports without
  evidence, blocked dialogs.
- Checks: a test command that was missing, unwired, or too weak — an existing
  check that never ran is a finding, not an invitation to invent a new one. A
  mechanical violation gets a deterministic check (lint/hook/CI), not a
  reviewer rule; reserve reviewer rules for judgment calls. A repo with no
  guardrail running its checks is itself a finding.
- Flow: waits too long or too short, teardown friction, merge ordering
  surprises.
- Navigation: information the orchestrator hunted for — a recorded value or
  pointer would save it.
- Tool economy: expensive calls a cheaper call answers.
- The skills themselves: a no-op is a line the model obeys by default; settle
  disputed lines by running the skill, not by debate; delete the whole sentence.

## Close

Present the list; ask which improvements the user wants to act on. Apply
nothing without an explicit request.