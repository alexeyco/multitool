## MODIFIED Requirements

### Requirement: Repository tag workflow

The `repo-tag` skill and OpenCode `/repo.tag` command SHALL require a clean worktree and the configured default branch to be checked out, update that branch with a fast-forward-only pull, and verify release readiness before proposing a tag. Release readiness SHALL identify the repository's ecosystem and authoritative release version artifacts from its manifests, release configuration, documentation, and CI, and SHALL require all applicable release version fields to agree. For JavaScript or TypeScript projects, the workflow SHALL treat the root `package.json` version as authoritative and validate only applicable root lockfile version fields that are present; a missing lockfile SHALL NOT prevent release readiness. For Rust projects, it SHALL validate the package version in `Cargo.toml`; when a Herdr plugin manifest is present and applicable, it SHALL validate its release version against the Rust package version. For Go projects, it SHALL use a release version source only when project documentation or CI establishes that source as authoritative, and SHALL NOT treat the Go language version in `go.mod` as the release version. If no authoritative source can be identified or candidate sources conflict, the workflow SHALL report the paths and values and stop without tagging. When documentation or CI establishes multiple Go release version sources and their values conflict, the workflow SHALL report the paths and values and stop without tagging. A tracked root `CHANGELOG.md`, when present, SHALL have a top versioned entry that matches the release artifact version, has no matching local or remote `v<version>` tag, and accurately covers all changes in the diff from the preceding versioned entry's tagged baseline to the updated default-branch commit. When `CHANGELOG.md` is absent, the workflow SHALL skip checks that require changelog content and SHALL require an identifiable prior release tag baseline; if it cannot establish that baseline, it SHALL explain the missing evidence and stop. The workflow SHALL require approval of the exact tag and target commit before creating and pushing the tag, validate the tag as a Git ref, stop on update failure or tag collision, and never overwrite a tag.

#### Scenario: Validate JavaScript release versions

**WHEN** a JavaScript or TypeScript project has a root package manifest and lockfile with release version fields
**THEN** the workflow validates the root package version and applicable root lockfile version fields, and stops with the conflicting paths and values if they differ.

#### Scenario: Validate Rust release version

**WHEN** a Rust project uses `Cargo.toml` as its package manifest
**THEN** the workflow reads the package release version from `Cargo.toml` and uses it to validate or propose the release tag.

#### Scenario: Validate Herdr and Rust release versions

**WHEN** a Rust project also has an applicable `herdr-plugin.toml` release manifest
**THEN** the workflow checks that its release version agrees with the package version in `Cargo.toml` and stops with both values if they differ.

#### Scenario: Use a project-established Go release version

**WHEN** a Go project has a release version source that its documentation or CI identifies as authoritative
**THEN** the workflow validates the version from that source before proposing a tag.

#### Scenario: Do not treat the Go language version as a release version

**WHEN** `go.mod` is the only version-bearing file identified in a Go project
**THEN** the workflow reports that the Go language version does not establish a release version and stops without tagging.

#### Scenario: Stop when the release version source is unknown or ambiguous

**WHEN** the workflow cannot identify one authoritative release version source or finds conflicting candidate release sources
**THEN** it reports the relevant paths and values and stops without proposing a tag.

#### Scenario: Check changelog release coverage when present

**WHEN** a tracked root `CHANGELOG.md` exists
**THEN** the workflow retains the existing top-entry, prior tagged baseline, release diff coverage, version agreement, and matching-tag collision checks.

#### Scenario: Offer changelog preparation when the file is absent

**WHEN** the root `CHANGELOG.md` is absent and the user asks how to prepare release notes
**THEN** the workflow may offer `$docs-changelog` as a separate action and does not require the user to create a changelog to continue tag readiness checks.

#### Scenario: Stop when the changelog has no versioned top entry

**WHEN** `CHANGELOG.md` exists but has no versioned top entry
**THEN** the workflow reports that changelog release readiness cannot be established and stops without tagging.

#### Scenario: Stop when the preceding tagged changelog baseline is unavailable

**WHEN** `CHANGELOG.md` exists but its preceding versioned entry cannot be associated with its `v<version>` tag
**THEN** the workflow reports that it cannot establish the diff baseline and stops without tagging.

#### Scenario: Stop when the release diff is missing from the changelog

**WHEN** manual comparison shows that changes from the preceding versioned entry's tag to the updated default-branch commit are omitted from the top changelog entry
**THEN** the workflow reports the omitted changes and stops without tagging.

#### Scenario: Stop when changelog and release file versions differ

**WHEN** the top changelog version differs from any applicable authoritative release artifact version
**THEN** the workflow reports the mismatching paths and versions and stops without tagging.

#### Scenario: Stop when the changelog version already has a tag

**WHEN** a local or remote tag named `v<top changelog version>` already exists
**THEN** the workflow reports the existing tag and stops without replacing or pushing it.

#### Scenario: Proceed without changelog when release artifacts and a prior tag are established

**WHEN** the root `CHANGELOG.md` is absent, authoritative release artifact versions agree, and a prior release tag baseline is established
**THEN** the workflow skips changelog-only checks and continues through the remaining release readiness and tag safeguards.

#### Scenario: Stop without changelog when no prior tag baseline exists

**WHEN** the root `CHANGELOG.md` is absent and the workflow cannot establish a prior release tag baseline
**THEN** it reports the missing baseline evidence and stops without proposing a tag.

#### Scenario: Approve an exact tag and target

**WHEN** all release readiness checks pass and a candidate tag and updated configured-default-branch commit are available
**THEN** the workflow presents the exact tag and full SHA of the updated configured-default-branch commit and creates and pushes the tag only after the user approves both.

#### Scenario: Stop on a dirty worktree

**WHEN** the tag workflow starts with tracked or untracked changes in the worktree
**THEN** it stops before fetching or updating the default branch.

#### Scenario: Stop when not on the configured default branch

**WHEN** the configured default branch is known but a different branch is checked out
**THEN** the workflow reports the required branch and stops without switching branches or tagging.

#### Scenario: Stop when the default branch cannot be determined

**WHEN** the repository's configured default branch cannot be resolved
**THEN** the workflow reports that it cannot determine the default branch and stops without fetching or tagging.

#### Scenario: Update the configured default branch with fast-forward only

**WHEN** the worktree is clean and the configured default branch is checked out
**THEN** the workflow fetches from `origin` and updates that branch with `git pull --ff-only`.

#### Scenario: Update master with fast-forward only

**WHEN** the worktree is clean, the configured default branch is checked out, and that branch is `master`
**THEN** the workflow fetches from `origin` and updates `master` with `git pull --ff-only`.

#### Scenario: Stop when master cannot fast-forward

**WHEN** the fast-forward-only update of `master` fails
**THEN** the workflow reports the failure and does not create or push a tag.

#### Scenario: Update a configured default branch other than master with fast-forward only

**WHEN** the worktree is clean, the configured default branch is checked out, and that branch is not `master`
**THEN** the workflow fetches from `origin` and updates the configured default branch with `git pull --ff-only`.

#### Scenario: Stop when the default branch cannot fast-forward

**WHEN** the fast-forward-only update of the configured default branch fails
**THEN** the workflow reports the failure and does not create or push a tag.

#### Scenario: Ask for a tag when no convention is available

**WHEN** neither existing tag history nor `CONTRIBUTING.md` establishes a tag convention
**THEN** the workflow asks the user for the exact tag and does not guess a tag name.

#### Scenario: Stop when the tag name already exists

**WHEN** the proposed tag name already exists locally or on the remote
**THEN** the workflow stops without replacing or pushing that tag.

#### Scenario: Stop after a policy-rejected tag push

**WHEN** the remote rejects the approved tag push because of tag protection or repository policy
**THEN** the workflow reports the rejection and stops without retrying or changing the approved tag or target.
