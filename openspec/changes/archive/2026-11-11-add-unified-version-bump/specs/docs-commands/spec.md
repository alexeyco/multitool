## REMOVED Requirements

### Requirement: Collect eligible changelog changes

**Reason**: The changelog-only workflow is replaced by the unified `bump` workflow, which reviews tracked changes as part of an approved release-version update.
**Migration**: Use `$bump` in Codex or `/bump` in OpenCode.

#### Scenario: Review working tree and commits

**WHEN** the user requests a release-version bump and eligible tracked changes and commits exist since the baseline
**THEN** the `bump` workflow reviews them together, counts overlapping staged and unstaged hunks once, and excludes untracked files.

#### Scenario: No eligible changes exist

**WHEN** no eligible tracked changes or commits exist since the baseline
**THEN** the `bump` workflow reports that there is nothing to bump and writes no files.

### Requirement: Propose a concise versioned entry

**Reason**: Version selection and changelog-entry preparation are consolidated in the `bump` workflow.
**Migration**: Use `$bump` in Codex or `/bump` in OpenCode to propose the version and entry together.

#### Scenario: Summarize eligible changes

**WHEN** eligible changes are available for review
**THEN** the workflow proposes a SemVer version and a factual Keep a Changelog entry under applicable `Added`, `Changed`, or `Fixed` headings without dates or boilerplate.

#### Scenario: Select the initial version

**WHEN** no versioned changelog or tagged release baseline exists
**THEN** the workflow suggests `0.1.0` and asks the user to select a base commit before proceeding.

#### Scenario: Resolve an untagged version header

**WHEN** an untagged top changelog version does not meet the verified planned-bump conditions in the release-version-bump specification
**THEN** the workflow asks the user to select or establish a base before writing.

### Requirement: Obtain approval before writing a changelog entry

**Reason**: The `bump` workflow obtains approval for its combined release-version and changelog proposal.
**Migration**: Approve or revise the change set, proposed version, and exact entry in `$bump` or `/bump`.

#### Scenario: User approves the proposal

**WHEN** the user agrees to the reviewed change set, proposed version, and exact changelog text
**THEN** the workflow writes the approved version artifacts and changelog entry.

#### Scenario: User does not approve the proposal

**WHEN** the user declines or has not agreed to the required change set, version, and changelog text
**THEN** the workflow writes no version artifacts or changelog content.

### Requirement: Handle a missing changelog file

**Reason**: The optional changelog behavior is now part of the unified version-bump workflow.
**Migration**: Use `$bump` or `/bump`; if the user declines to create a missing changelog, approve the version-artifact bump without changelog text.

#### Scenario: User permits initial changelog creation

**WHEN** `CHANGELOG.md` is absent and the user agrees to create it
**THEN** the `bump` workflow proposes an approved version and changelog entry.

#### Scenario: User declines initial changelog creation

**WHEN** `CHANGELOG.md` is absent and the user declines creation
**THEN** the workflow may update authoritative version artifacts after the user approves the change set and version, and creates no changelog file.

### Requirement: Record this branch's implemented plugin changes under 0.1.0

**Reason**: This requirement described a one-time historical changelog entry and is no longer part of the ongoing release workflow.
**Migration**: No migration is needed; ongoing release entries are proposed by `$bump` or `/bump`.

#### Scenario: Propose the implemented plugin and workflow under 0.1.0

**WHEN** implementation of the original plugin change is complete
**THEN** the historical workflow records that entry in the existing `0.1.0` changelog heading and does not create another heading.

#### Scenario: Write the approved 0.1.0 branch entry

**WHEN** the user approved that historical change set, text, and `0.1.0` version
**THEN** the approved entry is written under the existing `0.1.0` heading.

#### Scenario: Do not write an unapproved branch entry

**WHEN** the user did not approve the historical change set, text, or version
**THEN** `CHANGELOG.md` remains unchanged.
