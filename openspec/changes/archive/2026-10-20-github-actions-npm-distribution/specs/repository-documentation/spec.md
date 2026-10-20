# repository-documentation Specification

## MODIFIED Requirements

### Requirement: Current-state README

The project README SHALL describe verified facts about the current repository, including its current Codex skills and OpenCode commands, relevant existing files, npm plugin installation through OpenCode's `plugins` configuration, and CI and release triggers.

#### Scenario: Reader checks the repository status

**WHEN** a reader opens the project README
**THEN** the README describes the repository and its current commands as they exist and does not present planned functionality as available.

#### Scenario: Reader installs the npm plugin

**WHEN** a reader follows the README's npm installation instructions
**THEN** the instructions identify the `@alexeyco/multitool` package, show how to add it to OpenCode's `plugins` configuration, and list the commands and skills the plugin registers.

#### Scenario: Reader checks CI and release behavior

**WHEN** a reader checks the README for automation details
**THEN** it states that CI runs on pull requests and pushes to `master`, and npm publishing runs on version tags that match the package version.

### Requirement: Factual contribution guidance

The contribution guide SHALL describe contribution expectations and the package validation commands actually defined by the repository, including the required Node.js version and tag-to-package version rule, without claiming other unverified checks.

#### Scenario: Contributor looks for validation commands

**WHEN** a contributor reads the contribution guide for project validation instructions
**THEN** the guide lists the defined `npm ci`, `make check`, and `npm pack --dry-run` validation steps and does not invent other build, test, or check commands.

#### Scenario: Contributor prepares an npm release

**WHEN** a contributor reads the release instructions
**THEN** the guide states that a `v*` tag must match the package version and point to a commit reachable from `master`, release validation must pass, and maintainers must configure `NPM_TOKEN` and the OIDC permission required for provenance.
