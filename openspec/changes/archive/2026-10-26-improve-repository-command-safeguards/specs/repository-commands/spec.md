## MODIFIED Requirements

### Requirement: Repository commit workflow

The `repo-commit` skill and OpenCode `/repo.commit` command SHALL inspect unstaged, staged, and untracked contents for secrets and junk files, run repository-defined checks, safely diagnose and fix causes of failed checks and rerun checks until all defined checks pass, group changes into logical commits, stage files only by explicit path, and require confirmation before creating each commit. If the cause cannot be fixed safely or required permissions or context are unavailable, the workflow SHALL report the failure and stop without creating a commit. When `openspec/` exists, before creating a commit the workflow SHALL inspect immediate subdirectories of `openspec/changes/`, excluding `archive/`; if any exist, it SHALL ask whether to commit now or archive changes first. If the user chooses to archive first, the workflow SHALL stop without creating a commit until the user reruns it. Before creating a commit while on the repository's default branch, the workflow SHALL ask whether committing there is acceptable. If the user declines, the workflow SHALL read `CONTRIBUTING.md`, propose a branch name following its documented naming rules, and create a local branch from the current `HEAD` only after the user approves the exact name. If no naming convention is documented, it SHALL ask the user to choose a naming format. The workflow SHALL continue on the selected branch and retain per-commit confirmation.

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
**THEN** the workflow diagnoses the cause, fixes it when safe and within available permissions and context, and reruns the defined checks until they all pass; it stops without creating a commit only when a safe repair or required permissions or context are unavailable.

#### Scenario: Repair a failed repository check

**WHEN** a repository-defined check fails for a cause that can be safely fixed with the available permissions and context
**THEN** the workflow fixes the cause and reruns the defined checks, repeating diagnosis and safe repairs as needed until all checks pass before preparing commits.

#### Scenario: Stop when a failed check cannot be fixed safely

**WHEN** a repository-defined check fails and its cause cannot be fixed safely, or required permissions or context are unavailable
**THEN** the workflow reports the failing check, its cause, and what is needed, then stops without creating a commit.

#### Scenario: Ask before committing with unarchived OpenSpec changes

**WHEN** `openspec/` exists and `openspec/changes/` contains any immediate subdirectory other than `archive/`
**THEN** the workflow asks whether to commit now or archive changes first, and creates no commit until the user chooses.

#### Scenario: Stop when the user chooses to archive first

**WHEN** unarchived OpenSpec change directories exist and the user chooses to archive them before committing
**THEN** the workflow stops without creating a commit and tells the user to rerun the commit workflow after archiving.

#### Scenario: Confirm commits on the default branch

**WHEN** the workflow is ready to create a commit while the current branch is the repository's default branch
**THEN** it asks whether committing on that branch is acceptable before proceeding with the commit.

#### Scenario: Create a branch when the user declines the default branch

**WHEN** the user declines to commit on the repository's default branch
**THEN** the workflow reads `CONTRIBUTING.md`, proposes a branch name following its documented rules, and creates the branch from the current `HEAD` only after the user approves the exact name; it then continues the commit workflow on that branch.

#### Scenario: Confirm each logical commit

**WHEN** changes are ready to commit and any OpenSpec checkpoint has been resolved
**THEN** the workflow presents each logical commit message and its file list separately and creates each commit only after the user confirms it.

### Requirement: Repository push workflow

The `repo-push` skill and OpenCode `/repo.push` command SHALL list commits to be pushed, identify when the local branch is behind its upstream, require confirmation before pushing, and prohibit force pushes unless the user individually and explicitly requests one. If the remote explicitly rejects a push because of branch protection or repository policy, the workflow SHALL propose a local branch name using the naming rules in `CONTRIBUTING.md`, show the exact name, and create the branch from the current `HEAD` only after the user approves it. The workflow SHALL review the pending commits and require separate confirmation before pushing the new branch.

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

#### Scenario: Propose a branch after a policy rejection

**WHEN** the remote explicitly rejects the push because the current branch is protected or repository policy prohibits the push
**THEN** the workflow proposes a branch name that follows `CONTRIBUTING.md`, shows the exact name, and waits for the user's confirmation before creating a local branch from the current `HEAD`.

#### Scenario: Confirm push to the recovery branch separately

**WHEN** the user approves creating the recovery branch
**THEN** the workflow reviews the commits and upstream status for that branch and asks for separate confirmation before pushing it.

#### Scenario: Do not create recovery branches for unrelated push failures

**WHEN** a push fails for a reason other than an explicit branch protection or repository policy rejection
**THEN** the workflow reports the failure and stops without creating a branch or retrying the push.

#### Scenario: Prohibit force push without individual request

**WHEN** a push would require rewriting remote history and the user has not individually and explicitly requested a force push
**THEN** the workflow refuses to force push.

### Requirement: Repository pull request workflow

The `repo-pr` skill and OpenCode `/repo.pr` command SHALL detect supported GitHub, GitLab including self-hosted instances, Forgejo, and Codeberg/Gitea providers; check the corresponding CLI and authentication before creating a request; use a matching provider request template when available and fill every section; otherwise use Summary, Changes, and Test plan sections; present request details; and require user confirmation. In Codex, the workflow SHALL run only provider CLI commands (`gh`, `glab`, or `tea`) outside the sandbox; all non-provider commands SHALL run in the existing execution context. The workflow SHALL consult `CONTRIBUTING.md` for branch naming rules when a feature branch is needed, and SHALL propose a name following documented rules rather than asking the user to choose a naming format. It SHALL NOT retry provider commands in the sandbox or ask the user to authenticate there after a sandbox-context failure; if host execution is unavailable, it SHALL stop and report that limitation.

#### Scenario: Stop when on the default branch

**WHEN** the current branch is the repository's default branch and `CONTRIBUTING.md` documents branch naming rules
**THEN** the workflow stops without creating a pull or merge request and proposes a feature branch name using the documented rules instead of asking the user to choose a naming format.

#### Scenario: Stop with uncommitted or unpushed work

**WHEN** the current branch has uncommitted changes or commits that have not been pushed
**THEN** the workflow stops and reports what must be committed or pushed before request creation.

#### Scenario: Run provider CLI commands outside the Codex sandbox

**WHEN** the request workflow in Codex needs to check or use a provider CLI
**THEN** it runs only `gh`, `glab`, or `tea` commands outside the sandbox, including authentication checks and request creation, while Git commands and CLI discovery run in the existing execution context.

#### Scenario: Do not retry provider authentication in the sandbox

**WHEN** a provider CLI command fails because it was run in the sandbox or host execution is unavailable
**THEN** the workflow does not retry in the sandbox or ask the user to authenticate there, and reports that provider access must be checked in the host execution context.

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

**WHEN** the provider is unsupported, its CLI is missing, or authentication fails in the host execution context
**THEN** the workflow reports the exact installation or login command needed and the provider's manual web path, and does not claim a request was created.
