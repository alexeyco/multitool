# Documentation Commands Specification

## Purpose

Provides a consistent way to review repository changes and record approved releases in the changelog.

## Requirements

### Requirement: Collect eligible changelog changes

The changelog command SHALL collect staged and unstaged changes to tracked files and commits since the selected changelog baseline, exclude untracked files, and review the combined changes without double-counting staged and unstaged hunks.

#### Scenario: Review working tree and commits

**WHEN** the user requests a changelog entry and eligible tracked changes and commits exist since the baseline
**THEN** the command reviews those changes together, counts overlapping staged and unstaged hunks once, and excludes untracked files.

#### Scenario: No eligible changes exist

**WHEN** no eligible tracked changes or commits exist since the baseline
**THEN** the command reports that there is nothing to add and does not create an empty entry.

### Requirement: Propose a concise versioned entry

The changelog command SHALL propose a SemVer version and a concise, factual Keep a Changelog entry using only the Added, Changed, and Fixed headings, without dates or boilerplate.

#### Scenario: Summarize eligible changes

**WHEN** eligible changes are available for review
**THEN** the command presents a proposed version and entry text that accurately describes those changes under the applicable Added, Changed, and Fixed headings.

#### Scenario: Select the initial version

**WHEN** the repository has no changelog version or tag baseline
**THEN** the command suggests version `0.1.0` and asks the user for a base commit before proceeding.

#### Scenario: Resolve an untagged version header

**WHEN** a changelog versioned header has no corresponding Git tag
**THEN** the command asks the user for a base commit before proceeding.

### Requirement: Obtain approval before writing a changelog entry

The changelog command SHALL obtain the user's agreement to the selected changes, proposed entry text, and proposed version before writing the changelog.

#### Scenario: User approves the proposal

**WHEN** the user agrees to the changes, text, and version
**THEN** the command writes the approved entry to the changelog.

#### Scenario: User does not approve the proposal

**WHEN** the user declines or has not agreed to the changes, text, and version
**THEN** the command does not write the proposed entry.

### Requirement: Handle a missing changelog file

The changelog command SHALL ask whether to create a root `CHANGELOG.md` when it does not exist and SHALL stop if the user declines.

#### Scenario: User permits initial changelog creation

**WHEN** `CHANGELOG.md` is absent and the user agrees to create it
**THEN** the command continues to propose an approved changelog entry.

#### Scenario: User declines initial changelog creation

**WHEN** `CHANGELOG.md` is absent and the user declines creation
**THEN** the command stops without creating the file.

### Requirement: Record this branch's implemented plugin changes under 0.1.0

The changelog workflow SHALL review the selected baseline and complete eligible branch change set, propose the exact factual entry text under version `0.1.0`, and obtain approval for the change set, exact text, and version before writing the root changelog.

#### Scenario: Propose the implemented plugin and workflow under 0.1.0

**WHEN** implementation of this change is complete and the selected baseline and complete eligible branch change set have been reviewed
**THEN** the workflow presents the exact entry text for the native npm plugin and CI/publish changes under `0.1.0`, along with the change set and version, and does not write yet.

#### Scenario: Write the approved 0.1.0 branch entry

**WHEN** the user approves the reviewed change set, exact text, and version `0.1.0`
**THEN** the workflow adds the approved changes under the existing `0.1.0` heading without creating a new version heading.

#### Scenario: Do not write an unapproved branch entry

**WHEN** the user has not approved or declines the proposed change set, exact text, or version
**THEN** the workflow leaves `CHANGELOG.md` unchanged.
