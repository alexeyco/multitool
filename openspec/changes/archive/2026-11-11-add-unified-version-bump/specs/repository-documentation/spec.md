## MODIFIED Requirements

### Requirement: Current-state README

The project README SHALL describe verified facts about the current repository, including its current Codex skills and OpenCode commands, relevant existing files, npm plugin installation through OpenCode's `plugin` configuration, and CI and release triggers.

#### Scenario: Reader checks the repository status

**WHEN** a reader opens the project README
**THEN** the README describes the repository and its current commands as they exist and does not present planned functionality as available.

#### Scenario: Reader installs the npm plugin

**WHEN** a reader follows the README's npm installation instructions
**THEN** the instructions identify the `@alexeyco/multitool` package, show how to add it to OpenCode's `plugin` configuration, and list the commands and skills the plugin registers, including `/bump` and `$bump` and excluding `/docs.changelog` and `$docs-changelog`.

#### Scenario: Reader checks CI and release behavior

**WHEN** a reader checks the README for automation details
**THEN** it states that CI runs on pull requests and pushes to `master`, and npm publishing runs on version tags that match the package version.
