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
2. If `openspec/` exists, inspect immediate subdirectories of
   `openspec/changes/`, excluding `archive/`. If any remain, ask whether to
   commit now or archive changes first. If the user chooses to archive first,
   stop without creating a commit and tell them to rerun `/repo.commit` after
   archiving.
3. Exclude secrets and junk, including SSH configuration, private keys,
   tokens, credentials, caches, and build artifacts. Report every excluded
   path as a separate line. Never stage excluded files.
4. Find and run the checks defined by `AGENTS.md`, `CONTRIBUTING.md`, the
   Makefile, package scripts, and CI configuration. If the repository defines
   no checks, skip this step. When a check fails, diagnose its cause from the
   check output and relevant repository files. Fix the cause when the repair
   is safe and within the available permissions and context, then rerun the
   defined checks. Repeat diagnosis, safe repairs, and check runs until every
   defined check passes. If the cause cannot be fixed safely, or required
   permissions or context are unavailable, report the failing check, its
   cause, and what is needed; stop without creating a commit. Do not skip,
   weaken, or silence a failing check to proceed.
5. Group related changes into logical commits, generally one per task. Keep
   unrelated work separate and keep changes that only make sense together in
   one commit.
6. Write messages in the style of recent history: same language and verb
   tense, at most 72 characters, and prefixes only when the repository uses
   them. If history is empty or inconsistent, follow repository documentation.
7. Before creating each proposed commit, determine whether the current branch
   is the repository's default branch using
   `git symbolic-ref refs/remotes/origin/HEAD` or provider data. If the current
   branch is the default branch, ask whether the user is comfortable committing
   there. If the user declines, read `CONTRIBUTING.md` and propose a branch name
   following its documented naming rules. When no naming convention is
   documented, ask the user to choose a naming format. Obtain approval of the
   exact branch name before creating it from the current `HEAD` with
   `git switch -c <name>`, then verify the new current branch and continue.
   If the default branch cannot be determined, stop and ask the user which
   branch is the default. If the user approves committing on the default branch,
   continue without switching branches.
8. Present each proposed commit's number, message, and exact file list. Obtain
   confirmation for each commit before creating it.
9. After confirmation, stage only reviewed paths listed for that commit, using
   `git add <explicit-paths>`. Never use `git add -A` or `git add .`. Then run
   `git commit -m "<message>"`.
10. Report each created commit's hash and message, plus any excluded paths.

Never push or rewrite existing history. Create only new commits on top of
`HEAD`.
