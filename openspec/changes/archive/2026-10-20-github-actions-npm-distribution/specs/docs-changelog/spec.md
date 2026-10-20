# docs-changelog Specification

## ADDED Requirements

### Requirement: Record this branch's implemented plugin changes under 0.1.0

The changelog workflow SHALL review the selected baseline and complete eligible branch change set, propose the exact factual entry text under version `0.1.0`, and obtain approval for the change set, exact text, and version before writing the root changelog.

#### Scenario: Propose the implemented plugin and workflow under 0.1.0

**WHEN** implementation of this change is complete and the selected baseline and complete eligible branch change set have been reviewed
**THEN** the workflow presents the exact entry text for the native npm plugin and CI/publish changes under `0.1.0`, along with the change set and version, and does not write yet.

#### Scenario: Write the approved 0.1.0 branch entry

**WHEN** the user approves the reviewed change set, exact entry text, and version `0.1.0`
**THEN** the workflow adds the approved changes under the existing `0.1.0` heading without creating a new version heading.

#### Scenario: Do not write an unapproved branch entry

**WHEN** the user has not approved or declines the proposed change set, exact text, or version
**THEN** the workflow leaves `CHANGELOG.md` unchanged.
