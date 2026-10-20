## ADDED Requirements

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

The project SHALL map OpenCode `/repo.branch` to the Codex skill `repo-branch`, `/repo.commit` to `repo-commit`, `/repo.trunk` to `repo-trunk`, `/repo.push` to `repo-push`, and `/repo.pr` to `repo-pr`. Each OpenCode command SHALL invoke its mapped Codex skill, and both hosts SHALL preserve the safeguards specified for that workflow.

#### Scenario: Invoke a workflow on either host

**WHEN** a user invokes a mapped skill directly in Codex or its dotted command in OpenCode
**THEN** the corresponding workflow runs with the same behavior and safeguards on either host.
