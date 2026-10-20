# github-release-pipeline Specification

## ADDED Requirements

### Requirement: Validate pull requests and master updates

The GitHub Actions CI workflow SHALL run for pull requests and pushes to `master`, use Node.js 22, install from the lockfile with `npm ci`, run `make check`, and verify package contents with `npm pack --dry-run`.

#### Scenario: Validate a pull request

**WHEN** a pull request targets the repository
**THEN** CI installs dependencies with `npm ci`, runs `make check`, and runs `npm pack --dry-run` using Node.js 22.

#### Scenario: Validate a master push

**WHEN** a commit is pushed to `master`
**THEN** CI runs the same package checks using Node.js 22.

#### Scenario: Fail CI when package validation fails

**WHEN** dependency installation, `make check`, or the npm pack dry run fails
**THEN** the workflow reports failure and does not publish the package.

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
