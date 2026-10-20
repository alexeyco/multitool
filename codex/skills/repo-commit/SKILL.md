---
name: repo-commit
description: Review repository changes, run defined checks, and create separately confirmed logical commits.
---

# Create commits

Create commits from the current working tree only after reviewing all proposed
changes and obtaining confirmation for each commit.

## Procedure

1. Inspect `git status --short --branch`, recent commit messages with
   `git log --oneline -15`, unstaged changes with `git diff`, staged changes
   with `git diff --cached`, and the full contents of every untracked file.
   Identify which task each change serves.
2. Exclude secrets and junk, including SSH configuration, private keys,
   tokens, credentials, caches, and build artifacts. Report every excluded
   path as a separate line. Never stage excluded files.
3. Find and run the checks defined by `AGENTS.md`, `CONTRIBUTING.md`, the
   Makefile, package scripts, and CI configuration. If the repository defines
   no checks, skip this step. If any defined check fails, report the failure
   and stop without creating a commit.
4. Group related changes into logical commits, generally one per task. Keep
   unrelated work separate and keep changes that only make sense together in
   one commit.
5. Write messages in the style of recent history: same language and verb
   tense, at most 72 characters, and prefixes only when the repository uses
   them. If history is empty or inconsistent, follow repository documentation.
6. For each proposed commit, present its number, message, and exact file list.
   Obtain confirmation for each commit before creating it.
7. After confirmation, stage only reviewed paths listed for that commit, using
   `git add <explicit-paths>`. Never use `git add -A` or `git add .`. Then run
   `git commit -m "<message>"`.
8. Report each created commit's hash and message, plus any excluded paths.

Never push or rewrite existing history. Create only new commits on top of
`HEAD`.
