---
name: repo-trunk
description: Update the repository default branch and safely review local branch cleanup candidates.
---

# Return to the default branch

Update the repository's default branch and report local branches that remain
ahead of or behind it. Cleanup operates on local branches only.

## Procedure

1. Inspect `git status --short --branch`. If the working tree is dirty, stop
   before fetching, pruning, switching, pulling, or cleaning. Suggest
   `/repo.commit` or stashing the changes.
2. Determine the default branch from
   `git symbolic-ref refs/remotes/origin/HEAD`, falling back to `main` or
   `master` if present on the remote. If it cannot be determined, ask the user.
3. Run `git fetch --prune`, switch to the default branch, then run
   `git pull --ff-only`. If the update fails, report the failure and stop
   without cleaning branches or rewriting history.
4. Determine local branches merged into the updated default branch with
   `git branch --merged <default>`, excluding the default branch. These are
   safe-deletion candidates for ordinary `git branch -d` only.
5. For branches not reported as Git-merged (including squash-merged branches),
   check whether a supported provider confirms a merged pull request or merge
   request from that exact source branch. The evidence must include the
   provider's merged state and source head SHA. Compare the source head SHA
   exactly with the local branch's current `git rev-parse <branch>` SHA.
   Do not infer a match from branch name, commit subject, merge commit, or
   remote tracking state. GitHub can provide `mergedAt`, `headRefName`, and
   `headRefOid` through `gh pr` data; use equivalent authenticated request
   data from GitLab (`glab`), Forgejo, Codeberg, or Gitea where available.
   If the provider, CLI, authentication, merged status, or source SHA is
   unavailable, or the SHA differs, retain and report the branch. It is not
   eligible for `-D`.
6. Report branches to keep with their ahead and behind counts relative to the
   updated default branch. Present deletion candidates separately, identifying
   which use `-d` and which qualify for `-D` with the matching request and SHA
   evidence. Ask for explicit confirmation before deleting any local branch.
7. After confirmation, delete Git-merged candidates with `git branch -d
   <branch>`. Delete a non-Git-merged candidate with `git branch -D <branch>`
   only if its provider-confirmed request is merged and its local HEAD exactly
   equals the verified source head SHA. Keep all candidates whose evidence is
   missing or mismatched, even when the user confirms deletion of other
   candidates.
8. Report the default branch and its HEAD, deleted branches, retained
   branches, and ahead/behind counts.

Never delete remote branches or use a provider cleanup command that can delete
remote branches. Fetch pruning may remove stale remote-tracking refs as part of
the explicitly requested fetch step; it does not delete remote refs.
