# Repository Commands Specification

## Purpose

TBD: Update Purpose after archive.

## Requirements

### Requirement: Repository branch workflow

The `repo-branch` skill and OpenCode `/repo.branch` command SHALL provide the existing branch selection workflow, operate on the current HEAD, and avoid pushing or deleting branches. When no branch naming convention is documented, the workflow SHALL ask the user to choose a naming format rather than invent one.

#### Scenario: Approve a chosen branch name

**WHEN** a user invokes the branch workflow to create a branch
**THEN** the workflow proposes a name using the documented naming rules, or asks the user to choose a naming format when none is documented, and creates or selects the branch only after the user approves the chosen name.

#### Scenario: Ask before documenting a branch naming convention

**WHEN** the user chooses a branch naming format and the workflow would add it to project documentation
**THEN** the workflow obtains separate user approval before writing that convention into documentation.

#### Scenario: Stop on detached HEAD

**WHEN** the repository is in detached HEAD state
**THEN** the workflow stops and asks the user to check out a branch before continuing.

#### Scenario: Require agreement on the branch base

**WHEN** creating a branch would require choosing a base and the user has not agreed to that base
**THEN** the workflow asks which base to use and does not choose an arbitrary base.

### Requirement: Repository commit workflow

The `repo-commit` skill and OpenCode `/repo.commit` command SHALL inspect unstaged, staged, and untracked contents for secrets and junk files, run repository-defined checks, group changes into logical commits, stage files only by explicit path, and require confirmation before creating each commit.

#### Scenario: Report excluded secret or junk files

**WHEN** proposed changes include files identified as secrets or junk
**THEN** the workflow excludes them from commits and reports each excluded file to the user.

#### Scenario: Inspect all proposed change states

**WHEN** the workflow reviews proposed changes
**THEN** it inspects unstaged and staged diffs and examines untracked file contents before deciding what can be committed.

#### Scenario: Stage only reviewed paths

**WHEN** the workflow stages files for a confirmed logical commit
**THEN** it stages only the explicit paths presented for that commit and never uses a broad add operation.

#### Scenario: Stop when repository checks fail

**WHEN** the repository defines checks and any check fails
**THEN** the workflow reports the failure and stops without creating a commit.

#### Scenario: Confirm each logical commit

**WHEN** changes are ready to commit
**THEN** the workflow presents each logical commit message and its file list separately and creates each commit only after the user confirms it.

### Requirement: Repository trunk workflow

The `repo-trunk` skill and OpenCode `/repo.trunk` command SHALL stop when the working tree is dirty, determine the repository's default branch, fetch and prune, update that branch using `pull --ff-only`, and report local branches that remain ahead of or behind the updated default branch.

#### Scenario: Stop on a dirty working tree

**WHEN** the user runs trunk maintenance with uncommitted changes
**THEN** the workflow stops before fetching, pruning, pulling, or cleaning branches.

#### Scenario: Update the default branch

**WHEN** the working tree is clean and the user runs trunk maintenance
**THEN** the workflow selects the repository's default branch, fetches and prunes remotes, and updates the default branch with `pull --ff-only`.

#### Scenario: Stop when fast-forward update fails

**WHEN** `pull --ff-only` cannot update the default branch
**THEN** the workflow stops and reports the failure without cleaning branches.

#### Scenario: Report retained branches and divergence

**WHEN** trunk maintenance completes its update
**THEN** the workflow reports branches it keeps and each branch's ahead and behind counts relative to the default branch.

### Requirement: Safe local branch cleanup

The `repo-trunk` workflow SHALL prompt before deleting local branches and SHALL never delete a remote branch unless the user explicitly requests remote deletion. It MAY use `-D` for a local branch only when the provider confirms a merged pull request or merge request and the local branch HEAD exactly matches the request's source head SHA. It SHALL retain and report branches when merge status or SHA cannot be verified or the SHA differs.

#### Scenario: Delete a Git-merged local branch after confirmation

**WHEN** Git reports a local branch merged into the updated default branch and the user confirms deletion
**THEN** the workflow deletes that local branch and leaves its remote branch intact.

#### Scenario: Delete a verified squash-merged local branch after confirmation

**WHEN** the provider confirms that a pull request or merge request from a local branch was merged, the local branch HEAD exactly matches its source head SHA, and the user confirms deletion
**THEN** the workflow may delete that local branch with `-D` and leaves its remote branch intact.

#### Scenario: Retain a branch when merge evidence is missing or differs

**WHEN** the provider cannot verify a merged request or source head SHA, or the local branch HEAD differs from that SHA
**THEN** the workflow keeps and reports the branch, even if the user confirms cleanup of other candidates.

### Requirement: Repository push workflow

The `repo-push` skill and OpenCode `/repo.push` command SHALL list commits to be pushed, identify when the local branch is behind its upstream, require confirmation before pushing, and prohibit force pushes unless the user individually and explicitly requests one.

#### Scenario: Set upstream when absent

**WHEN** the current branch has no upstream and has commits to push
**THEN** the workflow uses `git push -u origin <branch>` after confirmation.

#### Scenario: Stop when there is nothing to push

**WHEN** the current branch has no commits to push
**THEN** the workflow reports that there is nothing to push and stops without pushing.

#### Scenario: Offer recovery when the branch is behind

**WHEN** the local branch is behind its upstream
**THEN** the workflow offers updating from the repository's default branch or rebasing, and does not push until the user resolves the divergence.

#### Scenario: Review a push to the current branch

**WHEN** a user requests a push for the current branch and it is ready to push
**THEN** the workflow lists the commits, reports upstream status, and pushes only after confirmation without switching branches.

#### Scenario: Prohibit force push without individual request

**WHEN** a push would require rewriting remote history and the user has not individually and explicitly requested a force push
**THEN** the workflow refuses to force push.

### Requirement: Repository synchronization workflow

The `repo-sync` skill and OpenCode `/repo.sync` command SHALL check for a clean worktree, determine the default branch, fetch remote refs without pruning, and compare the current branch with `origin/<default>`. The workflow SHALL fast-forward when the current branch is behind only, report when no update is needed, and require the user's exact strategy choice and confirmation before merging or rebasing a diverged feature branch. It SHALL never switch branches or push.

#### Scenario: Stop when the worktree is dirty

**WHEN** the current worktree contains tracked or untracked changes
**THEN** the workflow stops before fetching and asks the user to commit or stash the changes.

#### Scenario: Stop from detached HEAD

**WHEN** the repository is in detached HEAD state
**THEN** the workflow stops and asks the user to check out a branch.

#### Scenario: Ask when the default branch is ambiguous

**WHEN** `origin/HEAD` does not identify the default branch and both `origin/main` and `origin/master` exist
**THEN** the workflow asks the user which branch to use and does not choose one arbitrarily.

#### Scenario: Fast-forward a branch that is behind only

**WHEN** the current branch has no commits beyond `origin/<default>` and is behind it
**THEN** the workflow updates the current branch with `git merge --ff-only origin/<default>`.

#### Scenario: Report a branch that already contains the default branch

**WHEN** the current feature branch is equal to or ahead of `origin/<default>`
**THEN** the workflow reports that no synchronization is needed and makes no change.

#### Scenario: Ask before reconciling a diverged feature branch

**WHEN** the feature branch and `origin/<default>` both contain unique commits
**THEN** the workflow reports ahead and behind counts, explains how merge and rebase affect commit history, recommends a strategy based on repository guidance and branch state with a reason, and performs neither until the user chooses and confirms one strategy.

#### Scenario: Do not reconcile a diverged default branch

**WHEN** the current branch is the default branch and it has diverged from `origin/<default>`
**THEN** the workflow reports the divergence and stops without merging or rebasing.

#### Scenario: Stop on update conflicts

**WHEN** a fast-forward, merge, or rebase fails or reports conflicts
**THEN** the workflow reports the repository state and stops without resolving, aborting, switching branches, or trying another strategy.

#### Scenario: Do not switch branches or push

**WHEN** synchronization completes
**THEN** the workflow leaves the current branch selected and does not push any commit.

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

### Requirement: Repository pull request workflow

The `repo-pr` skill and OpenCode `/repo.pr` command SHALL detect supported GitHub, GitLab including self-hosted instances, Forgejo, and Codeberg/Gitea providers; check the corresponding CLI and authentication before creating a request; use a matching provider request template when available and fill every section; otherwise use Summary, Changes, and Test plan sections; present request details; and require user confirmation.

#### Scenario: Stop when on the default branch

**WHEN** the current branch is the repository's default branch
**THEN** the workflow stops without creating a pull or merge request.

#### Scenario: Stop with uncommitted or unpushed work

**WHEN** the current branch has uncommitted changes or commits that have not been pushed
**THEN** the workflow stops and reports what must be committed or pushed before request creation.

#### Scenario: Create a request on a supported provider

**WHEN** the repository uses a supported provider, its CLI is available and authenticated, and the branch is ready
**THEN** the workflow prepares the pull or merge request, presents its target and content for review, and creates it only after user confirmation.

#### Scenario: Fill the matching request template

**WHEN** a matching GitHub, GitLab, Forgejo, or Gitea pull or merge request template exists
**THEN** the workflow uses it and fills every section before presenting the request for review.

#### Scenario: Use standard sections without a request template

**WHEN** no matching provider request template exists
**THEN** the workflow prepares the request with Summary, Changes, and Test plan sections.

#### Scenario: Give recovery steps when provider access is unavailable

**WHEN** the provider is unsupported, its CLI is missing, or authentication fails
**THEN** the workflow reports the exact installation or login command needed and the provider's manual web path, and does not claim a request was created.

### Requirement: Cross-host command and skill mapping

The project SHALL map OpenCode `/repo.branch` to the Codex skill `repo-branch`, `/repo.commit` to `repo-commit`, `/repo.trunk` to `repo-trunk`, `/repo.push` to `repo-push`, `/repo.sync` to `repo-sync`, `/repo.pr` to `repo-pr`, and `/repo.tag` to `repo-tag`. Each OpenCode command SHALL invoke its mapped Codex skill, and both hosts SHALL preserve the safeguards specified for that workflow.

#### Scenario: Invoke a workflow on either host

**WHEN** a user invokes a mapped skill directly in Codex or its dotted command in OpenCode
**THEN** the corresponding workflow runs with the same behavior and safeguards on either host.

#### Scenario: Invoke the tag workflow on either host

**WHEN** a user invokes `$repo-tag` in Codex or `/repo.tag` in OpenCode
**THEN** the repository tag workflow runs with the same behavior and safeguards on either host.
