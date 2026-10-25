# Design

## Approach

Keep workflow behavior in the existing Codex skills. OpenCode commands remain thin wrappers and inherit the same safeguards by invoking those skills. Update the repository command baseline with matching requirements and scenarios.

For pull requests, read `CONTRIBUTING.md` when a feature branch is needed and use its documented naming rules to suggest a suitable branch name. Run provider CLI commands in Codex outside the sandbox. Do not retry a provider command in the sandbox or ask the user to authenticate there after a sandbox-context failure; stop if the host execution context is unavailable.

For pushes, distinguish an explicit server rejection caused by branch protection or repository policy from unrelated push failures. After such a rejection, propose a branch name using `CONTRIBUTING.md`, show the exact name, and wait for approval before creating a local branch from the current `HEAD`. Review the pending push again and obtain a separate confirmation before pushing the new branch. Do not force push.

For commits, when `openspec/` exists, inspect immediate child directories of `openspec/changes/`, excluding `archive/`. If any remain, ask whether to continue with the commit or archive changes first. If the user chooses to archive first, stop the commit workflow and resume only after the user reruns it.

Before creating a commit while on the repository's default branch, ask whether committing there is acceptable. If the user declines, read `CONTRIBUTING.md`, propose a compliant branch name, and create a local branch from the current `HEAD` only after the user approves the exact name. If no naming convention is documented, follow the existing branch workflow's naming-format question. Continue the commit workflow on the selected branch and retain the separate confirmation for each commit.

## Files to touch

- `codex/skills/repo-pr/SKILL.md`
- `codex/skills/repo-push/SKILL.md`
- `codex/skills/repo-commit/SKILL.md`
- `openspec/specs/repository-commands/spec.md`
