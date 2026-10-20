---
name: repo-sync
description: Synchronize the current branch with the repository's default branch using a safe fast-forward, merge, or approved rebase.
---

# Synchronize the current branch

Bring the current branch up to date with the repository's default branch. Do
not switch branches or push commits.

## Procedure

1. Inspect `git status --short --branch` and the current branch. If the working
   tree contains tracked or untracked changes, stop before fetching and ask the
   user to commit or stash them. If `HEAD` is detached, stop and ask the user to
   check out a branch.
2. Determine the default branch from
   `git symbolic-ref refs/remotes/origin/HEAD`, falling back only when exactly
   one of `origin/main` or `origin/master` exists. If both fallback branches
   exist, or the default branch or `origin` is unavailable, stop and ask the
   user which remote branch to use.
3. Run `git fetch origin`. If fetching fails, report the error and stop. Do not
   prune refs or alter the working branch as part of fetching.
4. Compare the current branch with `origin/<default>` using
   `git rev-list --left-right --count origin/<default>...HEAD`.
   - If both counts are zero, report that the branch is already synchronized.
   - If the current branch is the default branch and it is ahead only, report
     that it is ahead of `origin/<default>` and stop. If it is behind only,
     update it with `git merge --ff-only origin/<default>`. If it has diverged,
     stop and report the counts; do not merge or rebase the default branch.
   - If the current branch is a feature branch and is ahead only, report that
     it already contains the default branch and stop. If it is behind only,
     update it with `git merge --ff-only origin/<default>`.
   - If a feature branch has diverged, report the exact ahead and behind
     counts. Check `CONTRIBUTING.md` and `AGENTS.md` for the repository's merge
     or rebase convention, then check for an upstream with
     `git rev-parse --abbrev-ref @{u}`. Treat a branch with an upstream, or
     uncertain sharing status, as shared; do not infer that it is private just
     because it has local commits. Explain that merge preserves
     commit IDs and adds a merge commit, while rebase replays local commits on
     the default branch and changes their IDs. Recommend one strategy using
     repository guidance and branch state: prefer merge for published or
     shared commits, and rebase only for a private branch without an upstream
     when the repository prefers linear history. If evidence is insufficient,
     recommend merge as the option that preserves commit IDs. State why the
     recommended choice fits this branch. Run neither until the user chooses
     and confirms the exact strategy.
5. If an update fails or reports conflicts, stop and report the repository
   state. Do not resolve conflicts, abort, retry with another strategy, switch
   branches, or push.
6. After a successful update, verify the new `HEAD` and compare it with
   `origin/<default>`. Report the strategy and resulting commit counts.

Never force-push, amend commits, or change any branch other than the current
branch.
