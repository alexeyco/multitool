---
name: repo-tag
description: Update the configured default branch and create and push an approved release tag.
---

# Tag a release

Create and push a release tag only after the release is ready and the user
approves the exact tag and target commit.

## Procedure

1. Inspect `git status --short --branch` and the current branch. If the
   worktree has tracked or untracked changes, stop before fetching or
   updating any branch. If `HEAD` is detached, stop.
2. Determine the configured default branch from
   `git symbolic-ref refs/remotes/origin/HEAD`. If it is unavailable, fall
   back only when exactly one of `origin/main` and `origin/master` exists. If
   neither or both exist, or `origin` is unavailable, report that the default
   branch cannot be determined and stop without fetching. Require the
   configured default branch to already be checked out. If another branch is
   current, report the required branch and stop without switching branches.
3. Run `git fetch origin`. If fetching fails, report the failure and stop.
   Update the checked-out default branch with
   `git pull --ff-only origin "<default-branch>"`. If the pull fails, report
   the failure and stop without creating or pushing a tag. Record the full
   updated target SHA with `git rev-parse HEAD`.
4. Require a tracked root `CHANGELOG.md`. Check that it exists and is tracked
   with `git ls-files --error-unmatch CHANGELOG.md`. If it is absent, offer
   the user `$docs-changelog` to create and prepare it, then stop this tagging
   run. Let that workflow obtain separate approval for creating the file,
   change set, entry text, and version. Do not create or edit the changelog
   here.
5. Read the top two versioned headings in `CHANGELOG.md`. If there is no
   versioned top entry, report that release readiness cannot be established
   and stop. Require the preceding versioned entry to have a corresponding
   `v<version>` tag locally or remotely; if it does not, report that the
   changelog diff baseline cannot be established and stop. Compare the
   commits and complete diff from that preceding tag to the updated default
   branch commit with the top changelog entry. Report any changes omitted
   from the entry and stop if the entry does not cover the release diff.
6. Read the release version from the explicit release-file list:
   - `package.json`: root `version`.
   - `package-lock.json`: top-level `version` and
     `packages[""].version`.

   Require all three values to exist and match each other and the top
   versioned `CHANGELOG.md` heading. If a file cannot be read or parsed, a
   version is missing, or any values differ, report the files and values and
   stop. Add future manifest types to this explicit list only through a
   reviewed workflow change; do not infer release versions from unrelated
   version fields.
7. Set the candidate tag to `v<top changelog version>`, following the
   documented release convention. Check for that exact tag both locally with
   `git show-ref --verify "refs/tags/<tag>"` and remotely with
   `git ls-remote --tags origin "refs/tags/<tag>"`. If it exists locally or
   remotely, report the collision and stop without replacing or pushing it.
   If the remote check fails for a reason other than no matching ref, report
   the failure and stop. If neither tag history nor `CONTRIBUTING.md`
   establishes a tag convention, ask the user for the exact tag and do not
   guess a tag name.
8. Validate the proposed tag with
   `git check-ref-format "refs/tags/<tag>"`. If it is invalid, report that
   and ask for a valid exact tag. Present the exact tag and full target SHA,
   then ask for explicit approval to create and push that tag to `origin`.
   Do not proceed on ambiguous or partial approval. If the user changes
   either value, repeat validation and both collision checks, then ask for
   approval of the new exact pair.
9. After approval, create the tag at the approved SHA. Follow the tag object
   convention in existing tag history; if history does not establish one,
   create an annotated tag. Push only the exact tag name to `origin` with
   `git push origin "refs/tags/<tag>"`.
10. If the push is rejected by tag protection or repository policy, report
    the rejection and stop. Do not retry, force-push, replace the tag, or
    change the approved tag or target. Report the pushed tag and target SHA
    after a successful push.

Never overwrite or force-push a tag. Do not edit the changelog, create a
commit or pull request, switch branches, or delete branches as part of this
workflow.
