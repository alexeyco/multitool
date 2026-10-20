## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Validate pull requests and master updates

The GitHub Actions CI workflow SHALL run for pull requests and pushes to `master`, use Node.js 22, install from the lockfile with `npm ci`, run `make check` and the package's typecheck script, and verify package contents with `npm pack --dry-run`.

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
