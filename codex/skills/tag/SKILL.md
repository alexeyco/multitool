---
name: tag
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
4. Identify the release version artifacts from the repository's manifests,
   release configuration, documentation, and CI. Determine which package or
   release unit the repository tags; do not treat dependency versions,
   language versions, or unrelated package versions as release versions.
   - JavaScript or TypeScript: use the root `package.json` `version`. Compare
     each present applicable root lockfile release-version field. For
     `package-lock.json`, check the top-level `version` and
     `packages[""].version` when present. A missing lockfile does not block
     release readiness.
   - Rust: use the package `version` in `Cargo.toml`, including an inherited
     workspace package version when declared. If an applicable
     `herdr-plugin.toml` is present, compare its release `version` with the
     Rust package version.
   - Go: use a release version source only when repository documentation or
     CI identifies it as authoritative. `go.mod`'s `go` directive is a
     language version, not a release version.
   If documentation, CI, or the manifest's purpose does not establish one
   authoritative release version source, or if applicable sources conflict,
   report the candidate paths and values and stop without proposing a tag.
   When multiple Go sources are established, require their versions to agree.
   Do not guess a version field or add package formats by treating arbitrary
   files as release manifests.
5. Check whether the tracked root `CHANGELOG.md` exists with
   `git ls-files --error-unmatch CHANGELOG.md`.
   - If present, read its top two versioned headings. If there is no versioned
     top entry, report that release readiness cannot be established and stop.
     Require the preceding versioned entry to have its corresponding release
     tag locally or remotely; if it does not, report that the changelog diff
     baseline cannot be established and stop. Compare the commits and complete
     diff from that preceding tag to the updated default branch commit with
     the top entry. Report any changes omitted from the entry and stop if it
     does not cover the release diff. Require the top heading version to match
     every applicable authoritative release artifact version.
   - If absent, skip only checks that require changelog content. Identify the
     preceding release tag from the established tag convention and tag
     history. If no prior release tag baseline can be established, report the
     missing evidence and stop without proposing a tag. Do not offer a
     standalone changelog-only command; this workflow does not create or edit
     the changelog.
6. Set the candidate release version from the top changelog heading when the
   changelog is present, or from the agreed authoritative release artifacts
   when it is absent. Set the candidate tag according to the established
   release convention. If the version cannot be associated with a tag
   convention from tag history or `CONTRIBUTING.md`, ask the user for the exact
   tag and do not guess. Check for that exact tag both locally with
   `git show-ref --verify "refs/tags/<tag>"` and remotely with
   `git ls-remote --tags origin "refs/tags/<tag>"`. If it exists locally or
   remotely, report the collision and stop without replacing or pushing it.
   If the remote check fails for a reason other than no matching ref, report
   the failure and stop.
7. Validate the proposed tag with
   `git check-ref-format "refs/tags/<tag>"`. If it is invalid, report that
   and ask for a valid exact tag. Present the exact tag and full target SHA,
   then ask for explicit approval to create and push that tag to `origin`.
   Do not proceed on ambiguous or partial approval. If the user changes
   either value, repeat validation and both collision checks, then ask for
   approval of the new exact pair.
8. After approval, create the tag at the approved SHA. Follow the tag object
   convention in existing tag history; if history does not establish one,
   create an annotated tag. Push only the exact tag name to `origin` with
   `git push origin "refs/tags/<tag>"`.
9. If the push is rejected by tag protection or repository policy, report
    the rejection and stop. Do not retry, force-push, replace the tag, or
    change the approved tag or target. Report the pushed tag and target SHA
    after a successful push.

Never overwrite or force-push a tag. Do not edit the changelog, create a
commit or pull request, switch branches, or delete branches as part of this
workflow.
