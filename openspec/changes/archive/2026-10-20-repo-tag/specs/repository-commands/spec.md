## ADDED Requirements

### Requirement: Repository tag workflow

The `repo-tag` skill and OpenCode `/repo.tag` command SHALL update clean `master` with a fast-forward-only pull, derive a tag from existing tag history or `CONTRIBUTING.md`, and require approval of the exact tag and target commit before creating and pushing it. The workflow SHALL ask for the exact tag when no convention exists, validate the tag as a Git ref, stop on update failure or tag collision, and never overwrite a remote tag.

#### Scenario: Stop on a dirty worktree

**WHEN** the tag workflow starts with tracked or untracked changes in the worktree
**THEN** it stops before fetching, switching branches, or updating `master`.

#### Scenario: Update master with fast-forward only

**WHEN** the worktree is clean and the user invokes the tag workflow
**THEN** the workflow fetches from `origin`, switches to `master`, and updates it with `pull --ff-only`.

#### Scenario: Stop when master cannot fast-forward

**WHEN** the fast-forward-only update of `master` fails
**THEN** the workflow reports the failure and does not create or push a tag.

#### Scenario: Ask for a tag when no convention is available

**WHEN** neither existing tag history nor `CONTRIBUTING.md` establishes a tag convention
**THEN** the workflow asks the user for the exact tag and does not guess a version.

#### Scenario: Approve an exact tag and target

**WHEN** a candidate tag and updated `master` commit are available
**THEN** the workflow presents the exact tag and full target commit SHA and creates and pushes that tag only after the user approves both.

#### Scenario: Stop when the tag name already exists

**WHEN** the proposed tag name already exists locally or on the remote
**THEN** the workflow stops without replacing or pushing that tag.

#### Scenario: Stop after a policy-rejected tag push

**WHEN** the remote rejects the approved tag push because of tag protection or repository policy
**THEN** the workflow reports the rejection and stops without retrying or changing the approved tag or target.

## MODIFIED Requirements

### Requirement: Cross-host command and skill mapping

The project SHALL map OpenCode `/repo.branch` to the Codex skill `repo-branch`, `/repo.commit` to `repo-commit`, `/repo.trunk` to `repo-trunk`, `/repo.push` to `repo-push`, `/repo.pr` to `repo-pr`, and `/repo.tag` to `repo-tag`. Each OpenCode command SHALL invoke its mapped Codex skill, and both hosts SHALL preserve the safeguards specified for that workflow.

#### Scenario: Invoke a workflow on either host

**WHEN** a user invokes a mapped skill directly in Codex or its dotted command in OpenCode
**THEN** the corresponding workflow runs with the same behavior and safeguards on either host.

#### Scenario: Invoke the tag workflow on either host

**WHEN** a user invokes `$repo-tag` in Codex or `/repo.tag` in OpenCode
**THEN** the repository tag workflow runs with the same behavior and safeguards on either host.
