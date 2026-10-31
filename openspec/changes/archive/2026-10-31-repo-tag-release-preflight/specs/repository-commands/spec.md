## MODIFIED Requirements

### Requirement: Repository tag workflow

The `repo-tag` skill and OpenCode `/repo.tag` command SHALL require a clean worktree and the configured default branch to be checked out, update that branch with a fast-forward-only pull, and verify release readiness before proposing a tag. Release readiness SHALL require a tracked root `CHANGELOG.md` whose top versioned entry matches every version in the workflow's explicit release-file list (`package.json` and root `package-lock.json`), has no matching local or remote `v<version>` tag, and accurately covers all changes in the diff from the preceding versioned entry's tagged baseline to the updated default-branch commit. If the changelog is absent, the workflow SHALL offer `$docs-changelog` to create and prepare it, then stop without tagging. The workflow SHALL require approval of the exact tag and target commit before creating and pushing the tag, validate the tag as a Git ref, stop on update failure or tag collision, and never overwrite a tag. If the configured default branch, preceding tagged changelog baseline, or completeness of the changelog entry cannot be established, the workflow SHALL report the issue and stop without tagging.

#### Scenario: Stop on a dirty worktree

**WHEN** the tag workflow starts with tracked or untracked changes in the worktree
**THEN** it stops before fetching or updating the default branch.

#### Scenario: Stop when not on the configured default branch

**WHEN** the configured default branch is known but a different branch is checked out
**THEN** the workflow reports the required branch and stops without switching branches or tagging.

#### Scenario: Stop when the default branch cannot be determined

**WHEN** the repository's configured default branch cannot be resolved
**THEN** the workflow reports that it cannot determine the default branch and stops without fetching or tagging.

#### Scenario: Update master with fast-forward only

**WHEN** the worktree is clean, the configured default branch is checked out, and that branch is `master`
**THEN** the workflow fetches from `origin` and updates `master` with `git pull --ff-only`.

#### Scenario: Stop when master cannot fast-forward

**WHEN** the fast-forward-only update of `master` fails
**THEN** the workflow reports the failure and does not create or push a tag.

#### Scenario: Update a configured default branch other than master with fast-forward only

**WHEN** the worktree is clean, the configured default branch is checked out, and that branch is not `master`
**THEN** the workflow fetches from `origin` and updates the configured default branch with `git pull --ff-only`.

#### Scenario: Offer changelog preparation when the file is absent

**WHEN** the tracked root `CHANGELOG.md` does not exist
**THEN** the workflow offers `$docs-changelog` to create and prepare it, then stops this tagging run without creating or pushing a tag.

#### Scenario: Stop when the changelog has no versioned top entry

**WHEN** `CHANGELOG.md` exists but has no versioned top entry
**THEN** the workflow reports that release readiness cannot be established and stops without tagging.

#### Scenario: Stop when the preceding tagged changelog baseline is unavailable

**WHEN** the changelog's preceding versioned entry cannot be associated with its `v<version>` tag
**THEN** the workflow reports that it cannot establish the diff baseline and stops without tagging.

#### Scenario: Stop when the release diff is missing from the changelog

**WHEN** manual comparison shows that changes from the preceding versioned entry's tag to the updated default-branch commit are omitted from the top changelog entry
**THEN** the workflow reports the omitted changes and stops without tagging.

#### Scenario: Stop when changelog and release file versions differ

**WHEN** the top changelog version differs from the version in `package.json` or root `package-lock.json`
**THEN** the workflow reports the mismatching files and versions and stops without tagging.

#### Scenario: Stop when the changelog version already has a tag

**WHEN** a local or remote tag named `v<top changelog version>` already exists
**THEN** the workflow reports the existing tag and stops without replacing or pushing it.

#### Scenario: Ask for a tag when no convention is available

**WHEN** neither existing tag history nor `CONTRIBUTING.md` establishes a tag convention
**THEN** the workflow asks the user for the exact tag and does not guess a tag name.

#### Scenario: Approve an exact tag and target

**WHEN** all release readiness checks pass and a candidate tag and updated configured-default-branch commit are available
**THEN** the workflow presents the exact tag and full SHA of the updated configured default branch and creates and pushes that tag only after the user approves both.

#### Scenario: Stop when the tag name already exists

**WHEN** the proposed tag name already exists locally or on the remote
**THEN** the workflow stops without replacing or pushing that tag.

#### Scenario: Stop after a policy-rejected tag push

**WHEN** the remote rejects the approved tag push because of tag protection or repository policy
**THEN** the workflow reports the rejection and stops without retrying or changing the approved tag or target.
