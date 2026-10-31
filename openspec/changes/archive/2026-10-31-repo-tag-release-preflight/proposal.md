# Add release preflight checks to repository tagging

## Why now

The repository tag workflow can create a release tag without checking that the changelog describes all committed changes since the preceding release or that the release version is consistent across the package manifests. It also switches to `master` instead of requiring the user to start from the configured default branch.

## What changes

Require `$repo-tag` and `/repo.tag` to start from a clean configured default branch and update that branch with a fast-forward-only pull. Before asking for tag approval, verify that the top versioned changelog entry exists, matches the versions in the explicitly listed release files (`package.json` and root `package-lock.json`), has no matching local or remote tag, and accurately covers the diff since the preceding versioned entry's tag. Stop and report any missing or inconsistent evidence. If `CHANGELOG.md` is absent, offer to create and prepare it with `$docs-changelog`, then stop this tagging run without creating a tag.

Keep tag creation and push approval, ref validation, and collision safeguards. Do not change GitHub Actions publication workflows or have the tag workflow edit the changelog.

## Capabilities

Extends `repository-commands` with release readiness checks for the repository tag workflow.

ASSUMPTION: Read the package version from `package.json` and both the top-level `version` and root package `packages[""].version` in `package-lock.json`; require all three values to match (untested — a package-lock format without these root version fields would disprove this).

REJECTED-RISK: none.
