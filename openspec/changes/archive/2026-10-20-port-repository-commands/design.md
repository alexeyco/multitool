# Design: Port repository commands

## Approach

Package the five existing repository workflows as standalone Codex skills named with hyphenated IDs. Add OpenCode dotted commands under the `repo` namespace; each command delegates to the explicitly mapped skill: `/repo.branch` to `repo-branch`, `/repo.commit` to `repo-commit`, `/repo.trunk` to `repo-trunk`, `/repo.push` to `repo-push`, and `/repo.pr` to `repo-pr`. Keep each skill scoped to the behavior of its corresponding existing command. If repository documentation does not establish a branch naming convention, ask the user to choose the format; ask separately before adding the chosen convention to project documentation.

For trunk cleanup, stop on a dirty tree, determine the default branch, fetch and prune, and stop if `pull --ff-only` fails. Report kept branches with ahead and behind counts. Distinguish Git ancestry evidence from provider request evidence: a branch merged into the updated default branch can use ordinary safe deletion; a squash-merged branch is eligible for forced local deletion only after a supported provider confirms the request is merged and its source head SHA equals the local branch HEAD exactly. Any unavailable or mismatched evidence keeps the branch in the report. Ask before deleting candidates, and operate only on local refs.

The branch, commit, push, and pull request skills apply explicit stop and confirmation gates from the capability requirements. Commit inspects staged and unstaged diffs plus untracked file contents, checks repository-defined validation commands before writing commits, and stages only explicit reviewed paths. Push handles missing upstreams, no-op pushes, and behind-upstream recovery without force unless the user individually requests it. Pull request creation stops on the default branch or when local changes or commits remain uncommitted or unpushed, and gives provider-specific CLI/auth recovery plus a manual web path when automation is unavailable. For GitHub, GitLab, Forgejo, or Gitea, use the matching request template and fill every section; without one, use Summary, Changes, and Test plan.

## Files

- `codex/skills/repo-branch/SKILL.md` — branch naming, selection, and current-HEAD workflow.
- `codex/skills/repo-commit/SKILL.md` — secret checks, logical commits, and confirmation.
- `codex/skills/repo-trunk/SKILL.md` — trunk update and verified local branch cleanup.
- `codex/skills/repo-push/SKILL.md` — push review and confirmation safeguards.
- `codex/skills/repo-pr/SKILL.md` — provider detection, CLI/auth gates, and request confirmation.
- `opencode/commands/repo.branch.md` — delegates to `repo-branch`.
- `opencode/commands/repo.commit.md` — delegates to `repo-commit`.
- `opencode/commands/repo.trunk.md` — delegates to `repo-trunk`.
- `opencode/commands/repo.push.md` — delegates to `repo-push`.
- `opencode/commands/repo.pr.md` — delegates to `repo-pr`.

## Provider handling

Retain support for GitHub, GitLab including self-hosted instances, Forgejo, and Codeberg/Gitea using their existing command-line integrations and authentication checks. Do not use a provider cleanup command that can delete remote feature branches. If a provider cannot supply trustworthy merged status and source head SHA for squash-merge cleanup, report the candidate as unverifiable and keep it.

For request creation, use the matching GitHub, GitLab, Forgejo, or Gitea template when present and populate every section. If no matching template exists, prepare Summary, Changes, and Test plan sections.

## Trade-offs

Duplicating complete workflow instructions in host-specific command files risks behavior drift, so OpenCode command files remain thin skill invocations. Provider APIs and CLIs differ in the merge evidence they expose; conservative retention is the defined behavior when the exact evidence is unavailable.
