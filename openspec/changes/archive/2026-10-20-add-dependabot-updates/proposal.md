# Add Dependabot updates

## Why now

The repository has a locked npm dependency tree and GitHub Actions workflows, but no planned automated update schedule. Weekly updates can keep both dependency sources current while existing pull request validation checks the proposed changes.

## What changes

Configure Dependabot to check the root `package-lock.json` for npm dependencies and the repository's GitHub Actions workflows weekly. Group updates separately by ecosystem. Extend pull request CI to run the existing typecheck script alongside `make check` and `npm pack --dry-run`, including on Dependabot pull requests.

## Capabilities

This change extends `github-release-pipeline` with dependency update configuration and CI validation coverage.

ASSUMPTION: Dependabot uses GitHub's built-in weekly schedule and groups updates separately for npm and GitHub Actions, as confirmed in the playback.

## Out of scope

Dependabot alerts, GitHub security settings, and npm registry configuration are outside this change.
