# Port repository commands

## Why now

The repository is being prepared to host reusable Codex and OpenCode tooling. Five established repository workflows already exist as personal OpenCode commands, so porting those workflows gives the project a concrete, useful first plugin feature before a later change defines a generic command format.

## What changes

Add the `repo-branch`, `repo-commit`, `repo-trunk`, `repo-push`, and `repo-pr` skills for direct use in Codex. Add matching OpenCode commands `/repo.branch`, `/repo.commit`, `/repo.trunk`, `/repo.push`, and `/repo.pr`; each command invokes its matching skill. Preserve the workflows' existing safeguards and provider support, including Forgejo. Pull request creation uses and fills every section in a matching provider template, or uses Summary, Changes, and Test plan when no template exists. Commit review covers staged, unstaged, and untracked contents and stages reviewed files only by explicit paths. When documentation has no branch naming convention, ask the user to choose a format and obtain separate approval before adding it to documentation. Make trunk cleanup recognize a squash-merged pull or merge request only when the provider confirms the merge and the local branch head exactly matches the source head SHA.

## Capabilities

Adds the `repository-commands` capability for the five repository workflows across Codex and OpenCode.

## Scope

This change ports the existing five workflows and improves safe local branch cleanup. It does not introduce a generic command generator or format for arbitrary tools, and it does not modify the source command files in `~/dotfiles`.

ASSUMPTION: skill texts remain English, matching source commands.

The user confirmed that source command files under `~/dotfiles` remain unchanged; this change adds the port in this repository only.

REJECTED-RISK: none.
