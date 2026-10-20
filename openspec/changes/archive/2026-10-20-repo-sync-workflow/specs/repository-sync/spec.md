# repository-sync Specification

## ADDED Requirements

### Requirement: Synchronize the current branch with the default branch

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
