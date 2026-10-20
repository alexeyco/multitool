# GitHub Release Pipeline Specification

## Purpose

TBD: Update Purpose after archive.

## Requirements

### Requirement: Validate pull requests and master updates

The GitHub Actions CI workflow SHALL run for pull requests and pushes to `master`, use Node.js 22, install from the lockfile with `npm ci`, run `make check` and `npm run typecheck`, and verify package contents with `npm pack --dry-run`.

#### Scenario: Validate a pull request

**WHEN** a pull request targets the repository, including a Dependabot pull request
**THEN** CI installs dependencies with `npm ci`, runs `make check`, runs `npm run typecheck`, and runs `npm pack --dry-run` using Node.js 22.

#### Scenario: Validate a master push

**WHEN** a commit is pushed to `master`
**THEN** CI runs the same package checks, including `npm run typecheck`, using Node.js 22.

#### Scenario: Fail CI when package validation fails

**WHEN** dependency installation, `make check`, or the npm pack dry run fails in the publish workflow
**THEN** the publish workflow reports failure and does not publish the package.

#### Scenario: Fail CI when CI package validation fails

**WHEN** dependency installation, `make check`, `npm run typecheck`, or the npm pack dry run fails in the CI workflow
**THEN** the CI workflow reports failure for that pull request or master push.

### Requirement: Check npm dependencies weekly with Dependabot

Dependabot SHALL check the root npm dependency manifest and lockfile weekly and group npm dependency updates together.

#### Scenario: Check npm dependencies weekly

**WHEN** the configured weekly npm update schedule runs
**THEN** Dependabot checks dependencies declared in the root `package.json` and `package-lock.json`.

#### Scenario: Group npm dependency updates

**WHEN** Dependabot proposes npm dependency updates
**THEN** it groups the updates for the npm ecosystem together, separately from GitHub Actions updates.

### Requirement: Check GitHub Actions weekly with Dependabot

Dependabot SHALL check GitHub Actions dependencies used by repository workflows weekly and group those updates separately from npm updates.

#### Scenario: Check GitHub Actions weekly

**WHEN** the configured weekly GitHub Actions update schedule runs
**THEN** Dependabot checks dependencies used by workflows in `.github/workflows/`.

#### Scenario: Group GitHub Actions updates separately

**WHEN** Dependabot proposes GitHub Actions updates
**THEN** it groups them for the GitHub Actions ecosystem separately from npm dependency updates.

### Requirement: Publish a version-matched public npm package with provenance

The publish workflow SHALL run only for pushed tags matching `v*`, use Node.js 22 and the npm registry, fetch full Git history, require the tag to equal `v` followed by the package version, require the tagged commit to be reachable from `master`, pass the package checks, and publish `@alexeyco/multitool` publicly with npm provenance.

#### Scenario: Publish a matching version tag

**WHEN** a `v*` tag equals `v` followed by the version in `package.json`, its commit is reachable from `master`, release validation passes, and npm authentication succeeds
**THEN** the workflow publishes the package with public access and provenance.

#### Scenario: Reject a tag that does not match the package version

**WHEN** a pushed `v*` tag differs from `v` followed by the version in `package.json`
**THEN** the publish workflow fails before publishing.

#### Scenario: Reject a tag commit that is not on master

**WHEN** a version-matched `v*` tag points to a commit that is not reachable from `master`
**THEN** the publish workflow fails before publishing.

#### Scenario: Fetch full history for the master ancestry check

**WHEN** the publish workflow checks whether the tagged commit is reachable from `master`
**THEN** checkout fetches full Git history with `fetch-depth: 0` or an equivalent fetch operation before the ancestry check.

#### Scenario: Validate a release before publishing

**WHEN** the version tag and master ancestry checks pass
**THEN** the workflow runs `npm ci`, `make check`, and `npm pack --dry-run`, and publishes only if every command succeeds.

#### Scenario: Do not publish on pull requests or branch pushes

**WHEN** a pull request is opened or a branch commit is pushed without a version tag
**THEN** the workflow does not publish to npm.

#### Scenario: Use scoped publish permissions and authentication

**WHEN** the publish job runs
**THEN** it uses the `NPM_TOKEN` secret, grants only repository-content read access and the OIDC permission needed for provenance, and does not expose the token to pull request validation.
