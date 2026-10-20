---
name: repo-tag
description: Update master and create and push an approved repository tag.
---

# Tag a release

Update `master`, choose a tag using the repository's established convention,
and create and push it only after the user approves the exact tag and target.

## Procedure

1. Inspect `git status --short --branch`. If the worktree has tracked or
   untracked changes, stop before fetching or switching branches.
2. Run `git fetch origin`. If fetching fails, report the failure and stop.
3. Switch to `master` with `git switch master`, then update it with
   `git pull --ff-only origin master`. If switching or updating fails, report
   the failure and stop. Do not create or push a tag after an update failure.
4. Record the full updated target SHA with `git rev-parse master`. Derive a
   candidate tag only from the existing tag history or a tag convention
   explicitly documented in `CONTRIBUTING.md`. Do not infer a convention
   from the changelog or other files. If neither source establishes a
   convention, ask the user for the exact tag; do not guess a version.
5. Validate the proposed tag with `git check-ref-format "refs/tags/<tag>"`.
   If it is invalid, report that and ask for a valid exact tag. Check for a
   local collision with `git show-ref --verify "refs/tags/<tag>"` and a
   remote collision with `git ls-remote --tags origin "refs/tags/<tag>"`.
   Stop if the tag exists locally or remotely. If the remote check fails for
   a reason other than no matching ref, report the failure and stop.
6. Present the exact tag and full target SHA. Ask for explicit approval to
   create and push that tag to `origin`. Do not proceed on ambiguous or
   partial approval. If the user changes either value, repeat validation and
   both collision checks, then ask for approval of the new exact pair.
7. After approval, create the tag at the approved SHA. Follow the tag object
   convention in existing tag history; if history does not establish one,
   create an annotated tag. Push only the exact tag name to `origin` with
   `git push origin "refs/tags/<tag>"`.
8. If the push is rejected by tag protection or repository policy, report
   the rejection and stop. Do not retry, force-push, replace the tag, or
   change the approved tag or target. Report the pushed tag and target SHA
   after a successful push.

Never overwrite or force-push a tag. Do not edit the changelog, create a
commit or pull request, or delete branches as part of this workflow.
