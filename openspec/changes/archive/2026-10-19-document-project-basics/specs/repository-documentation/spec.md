## ADDED Requirements

### Requirement: Current-state README

The project README SHALL describe only verified facts about the current repository, including its current status and relevant existing files.

#### Scenario: Reader checks the repository status

**WHEN** a reader opens the project README
**THEN** the README describes the repository as it currently exists and does not present planned functionality as available.

### Requirement: Factual contribution guidance

The contribution guide SHALL describe contribution expectations without claiming that unverified build, test, or check commands exist.

#### Scenario: Contributor looks for validation commands

**WHEN** a contributor reads the contribution guide for project validation instructions
**THEN** the guide does not invent build, test, or check commands that the repository does not define.
