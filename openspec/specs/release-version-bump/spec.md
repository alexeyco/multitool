# Release Version Bump Specification

## Purpose

Keeps project release versions and release notes aligned through one approved workflow that supports the ecosystems recognized by repository tagging.

## Requirements

### Requirement: Select a release version from a verified baseline

The `bump` skill and OpenCode `/bump` command SHALL review eligible tracked changes from a verified release baseline, identify exactly one release unit, and propose a SemVer version using minor increments for added functionality, patch increments for compatible changes or fixes, and major increments only for clearly documented breaking changes. They SHALL ask the user when the next version is ambiguous.

#### Scenario: Review tracked changes from a tagged changelog baseline

**WHEN** the root `CHANGELOG.md` has a top versioned entry associated with a release tag
**THEN** the command combines commits since that tag with the aggregate staged and unstaged tracked diff, avoids counting overlapping hunks twice, excludes untracked files, and proposes a version from the reviewed changes.

#### Scenario: Use an untagged changelog entry as the planned bump

**WHEN** the top changelog version is untagged, every authoritative manifest agrees with the immediately preceding changelog version, that preceding entry has a matching release tag, and the top entry covers the full diff since that tag
**THEN** the command treats the existing top changelog entry as the planned bump, proposes aligning the manifests to its version, and updates that entry without creating a duplicate version heading.

#### Scenario: Select a baseline when the changelog is absent

**WHEN** the root `CHANGELOG.md` is absent and all authoritative release artifacts for the selected unit agree on a current version with a matching prior release tag
**THEN** the command uses that tag as the baseline, reviews commits since the tag and aggregate staged and unstaged tracked changes, excludes untracked files, and proposes the next version from that eligible change set.

#### Scenario: Stop when a changelog-free baseline is unavailable

**WHEN** the root `CHANGELOG.md` is absent and the authoritative artifacts do not establish one agreed current version with a matching prior release tag
**THEN** the command reports the missing or conflicting baseline evidence and stops before proposing or writing a version bump.

#### Scenario: Stop when an untagged changelog baseline is unverified

**WHEN** the preceding changelog entry has no matching tag, the release diff is not covered by the untagged top entry, or the manifests do not agree with the preceding version
**THEN** the command reports the missing or conflicting evidence and asks the user to select or establish a baseline before writing any file.

#### Scenario: Ask for a baseline on an initial release

**WHEN** no versioned changelog and no tagged release baseline exist
**THEN** the command suggests `0.1.0` and asks the user to select a base commit before proceeding.

#### Scenario: Stop when there are no eligible changes

**WHEN** the selected baseline has no eligible commits or tracked working-tree changes
**THEN** the command reports that there is nothing to bump and writes no files.

#### Scenario: Stop when multiple release units are ambiguous

**WHEN** the project contains multiple independently versioned release units and repository configuration does not identify which unit to bump
**THEN** the command reports the candidate units and asks the user to resolve the target without writing files.

### Requirement: Update authoritative release version artifacts

The `bump` skill and OpenCode `/bump` command SHALL apply the approved version to every applicable authoritative version field for the selected release unit. They SHALL stop without partial edits when the source is unknown, ambiguous, or cannot be safely updated without unrelated dependency changes.

#### Scenario: Update JavaScript or TypeScript release artifacts

**WHEN** the selected release unit uses the root `package.json` version and has applicable lockfile release-version fields
**THEN** the command updates the root package version and all applicable present lockfile fields to the approved version, including the top-level and `packages[""].version` fields in `package-lock.json`.

#### Scenario: Update a Rust workspace release version

**WHEN** the selected Rust package declares its version in `Cargo.toml` or inherits it from `[workspace.package]`
**THEN** the command updates the authoritative manifest version and, when `Cargo.lock` contains the workspace package, updates only the workspace package entries using a Cargo-supported workspace-only operation.

#### Scenario: Align an applicable Herdr release manifest

**WHEN** the selected Rust package has an applicable `herdr-plugin.toml` release version
**THEN** the command updates it to the same approved version as the Rust package.

#### Scenario: Stop if Cargo would change unrelated dependencies

**WHEN** updating workspace package entries in `Cargo.lock` would also change unrelated dependency entries
**THEN** the command reports those changes and stops without writing any version artifact.

#### Scenario: Update a documented Go release version source

**WHEN** project documentation or CI establishes one safely editable Go release version field as authoritative
**THEN** the command updates that field to the approved version.

#### Scenario: Do not use the Go language version as a release version

**WHEN** `go.mod` is the only version-bearing artifact or no Go release source is established as authoritative and editable
**THEN** the command reports the unsupported or ambiguous source and writes no files.

#### Scenario: Stop when the release version source is unknown or ambiguous

**WHEN** the selected release unit has no established authoritative version source, or multiple candidate sources cannot be resolved
**THEN** the command reports the missing or conflicting authority evidence and stops without partially updating any release artifact.

### Requirement: Write an approved changelog entry when available

The `bump` skill and OpenCode `/bump` command SHALL prepare a factual Keep a Changelog entry under `Added`, `Changed`, or `Fixed` headings when a tracked root `CHANGELOG.md` exists, and SHALL obtain approval of the reviewed change set, exact proposed version, and exact entry text before writing. They SHALL not add dates, empty headings, or boilerplate.

#### Scenario: Prepare an entry for an existing changelog

**WHEN** an approved bump is proposed and a tracked root `CHANGELOG.md` exists
**THEN** the command presents the complete entry under the approved version and writes it only after the user approves the change set, version, and exact text.

#### Scenario: Offer to create a missing changelog

**WHEN** the root `CHANGELOG.md` is absent
**THEN** the command asks whether to create it and, if accepted, includes the proposed entry in the approval request.

#### Scenario: Continue a manifest bump when changelog creation is declined

**WHEN** the root `CHANGELOG.md` is absent, a valid baseline is established from agreeing authoritative artifacts and a matching prior release tag, and the user declines to create it
**THEN** the command omits changelog text and updates the authoritative version artifacts after the user approves the change set and version.

#### Scenario: Avoid overwriting an untracked changelog

**WHEN** no tracked root `CHANGELOG.md` exists but an untracked file already occupies that path
**THEN** the command reports the conflict and does not read or overwrite that file.

#### Scenario: Leave files unchanged when the bump is not approved

**WHEN** the user declines the proposed change set or version, or has not approved all required values
**THEN** the command writes no version artifacts or changelog content.

#### Scenario: Leave changelog unchanged when its entry is not approved

**WHEN** the user approves the version artifact changes but declines or has not approved the exact entry text for an existing or newly created changelog
**THEN** the command writes no version artifacts or changelog content and reports the incomplete approval.

#### Scenario: Do not commit, push, or tag

**WHEN** the command finishes an approved bump
**THEN** it reports the changed files and version and does not commit, push, or create a release tag.
