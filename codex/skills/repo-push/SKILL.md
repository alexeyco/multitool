---
name: repo-push
description: Review commits on the current branch and push only after explicit confirmation.
---

# Push the current branch

Send local commits from the current branch to its remote. Never switch branches
or rewrite remote history unless the user individually and explicitly asks for
that action. A recovery branch may be created without switching to it after a
policy rejection, with the user's approval of its exact name.

## Procedure

1. Inspect `git status --short --branch`, determine the current branch with
   `git rev-parse --abbrev-ref HEAD`, and find its upstream with
   `git rev-parse --abbrev-ref @{u}`. If there is no upstream, plan to set it
   with `git push -u origin <branch>`.
2. List outgoing commits with `git log @{u}..HEAD --oneline` when an upstream
   exists. Without an upstream, check whether `origin/<branch>` exists. If it
   does, use `git log origin/<branch>..HEAD --oneline`. If it does not, find
   the repository's default branch and use
   `git log origin/<default>..HEAD --oneline` to show commits that the new
   branch will introduce. If no remote default branch is available, stop and
   ask the user which base to compare. If the selected range is empty, report
   “nothing to push” and stop.
3. Check whether the local branch is behind its upstream with
   `git log HEAD..@{u} --oneline`. If it is behind, offer to update from the
   repository's default branch or rebase with `git pull --rebase`. Do not push
   until the user resolves the divergence. If a rebase conflicts, stop and
   report the state; do not force it through.
4. Present the remote, current branch, outgoing commit list, upstream status,
   and whether `-u` is needed. Wait for user confirmation before pushing.
5. After confirmation, run `git push` (with `-u` when setting the upstream).
   If it succeeds, verify with `git status -sb` that the branch is no longer
   ahead.
6. If the remote explicitly reports that branch protection or repository
   policy rejected the push, read `CONTRIBUTING.md` and propose a name that
   follows its branch naming rules. Show the exact name and create the local
   branch from the current `HEAD` with `git branch <name> HEAD` only after the
   user approves that name. Do not switch branches.
7. Review the commits and upstream status that would be pushed from the new
   branch. Ask for separate confirmation before pushing it with
   `git push -u origin <name>`, then verify the new branch's upstream status.
   If the user declines branch creation or the push, stop without that action.
8. For any push failure that does not explicitly identify branch protection or
   repository policy as the cause, report the failure and stop. Do not create a
   recovery branch or retry the push.

Never use `--force` or `--force-with-lease` or rewrite other people's commits.
Push a branch other than the current one only when it is the approved recovery
branch and the user separately confirms that push.
