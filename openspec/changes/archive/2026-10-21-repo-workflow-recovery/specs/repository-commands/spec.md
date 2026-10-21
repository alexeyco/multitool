## MODIFIED Requirements

### Requirement: Repository commit workflow

The `repo-commit` skill and OpenCode `/repo.commit` command SHALL inspect unstaged, staged, and untracked contents for secrets and junk files, run repository-defined checks, safely diagnose and fix causes of failed checks and rerun checks until all defined checks pass, group changes into logical commits, stage files only by explicit path, and require confirmation before creating each commit. If the cause cannot be fixed safely or required permissions or context are unavailable, the workflow SHALL report the failure and stop without creating a commit.

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
**THEN** the workflow diagnoses the cause, fixes it when safe, and reruns the defined checks until all checks pass; it stops without creating a commit only if a safe fix or required permissions or context are unavailable.

#### Scenario: Repair a failed repository check

**WHEN** a repository-defined check fails and its cause can be fixed safely
**THEN** the workflow fixes the cause and reruns the defined checks, repeating diagnosis and safe repairs as needed until all defined checks pass before continuing commit preparation.

#### Scenario: Stop when a failed check cannot be fixed safely

**WHEN** a repository-defined check fails and the cause cannot be fixed safely or required permissions or context are unavailable
**THEN** the workflow reports the failure and stops without creating a commit.

#### Scenario: Confirm each logical commit

**WHEN** changes are ready to commit
**THEN** the workflow presents each logical commit message and its file list separately and creates each commit only after the user confirms it.

### Requirement: Repository pull request workflow

The `repo-pr` skill and OpenCode `/repo.pr` command SHALL detect supported GitHub, GitLab including self-hosted instances, Forgejo, and Codeberg/Gitea providers; check the corresponding CLI and authentication before creating a request; use a matching provider request template when available and fill every section; otherwise use Summary, Changes, and Test plan sections; present request details; and require user confirmation. In Codex, the workflow SHALL run only provider CLI commands (`gh`, `glab`, or `tea`) outside the sandbox.

#### Scenario: Stop when on the default branch

**WHEN** the current branch is the repository's default branch
**THEN** the workflow stops without creating a pull or merge request.

#### Scenario: Stop with uncommitted or unpushed work

**WHEN** the current branch has uncommitted changes or commits that have not been pushed
**THEN** the workflow stops and reports what must be committed or pushed before request creation.

#### Scenario: Run provider CLI commands outside the Codex sandbox

**WHEN** the `repo-pr` workflow runs in Codex and needs to check or use a supported provider CLI
**THEN** it runs only the provider CLI commands (`gh`, `glab`, or `tea`) outside the sandbox.

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
