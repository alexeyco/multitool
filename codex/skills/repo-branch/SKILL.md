---
name: repo-branch
description: Create a branch for the current task using repository naming rules and an explicitly approved name.
---

# Create a repository branch

Create a branch for the current task from the current `HEAD`. Do not push,
delete, or rename branches.

## Procedure

1. Inspect `git status --short --branch`, `git branch -a
   --format='%(refname:short)'`, and `git log --oneline -8`.
2. Determine the purpose from the user's request, conversation, or working
   tree. If it is unclear, ask what the branch is for; do not invent a purpose.
3. Read `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, `docs/`, CI configuration,
   and Git hooks for a documented branch naming convention. Do not infer a
   convention from existing branch names. If none is documented, ask the user
   to choose a format, offering examples such as
   `feat|fix|chore/<kebab-desc>`, `<kebab-desc>`, or
   `issue/<number>-<desc>`. Ask separately whether they want that chosen
   convention added to `CONTRIBUTING.md` or `AGENTS.md`; write it only after
   that separate approval.
4. Propose two or three short, specific, lowercase English kebab-case names
   shaped by the documented or user-chosen convention. Check that none already
   exists.
5. Ask the user to choose or edit a candidate. Do not create or select a branch
   before the user approves the exact name.
6. Use the current `HEAD` as the base. If `HEAD` is detached, stop and ask the
   user to check out a branch. If uncommitted changes exist, explain that they
   will carry over. If the user has not agreed to the base, ask which base to
   use; never choose an arbitrary commit.
7. Present the purpose, convention and its source, approved name, base commit,
   and command. After approval, run `git switch -c <name>` and verify with
   `git status -sb` that the new branch is current.

Never push the branch, set an upstream, delete or rename an existing branch,
or create it from a different commit than the agreed base.
