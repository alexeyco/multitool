## 1. Commit check recovery

- [x] 1.1 Update `codex/skills/repo-commit/SKILL.md` to diagnose failed checks, continue safe repairs and reruns until all checks pass, stop without committing only when a safe fix or required permissions or context are unavailable, and preserve existing review and confirmation safeguards. Covers scenarios “Stop when repository checks fail”, “Repair a failed repository check”, and “Stop when a failed check cannot be fixed safely”.
- [x] 1.2 Update `openspec/specs/repository-commands/spec.md` to match the revised repository commit workflow requirement and scenarios. Covers scenarios “Report excluded secret or junk files”, “Inspect all proposed change states”, “Stage only reviewed paths”, “Stop when repository checks fail”, “Repair a failed repository check”, “Stop when a failed check cannot be fixed safely”, and “Confirm each logical commit”.

## 2. Codex provider CLI execution

- [x] 2.1 Update `codex/skills/repo-pr/SKILL.md` to run only `gh`, `glab`, and `tea` provider CLI commands outside the sandbox in Codex, while preserving provider checks, request review, and confirmation before creation. Covers scenario “Run provider CLI commands outside the Codex sandbox”.
- [x] 2.2 Update `openspec/specs/repository-commands/spec.md` to specify the Codex provider CLI execution boundary while preserving the existing request workflow. Covers scenarios “Stop when on the default branch”, “Stop with uncommitted or unpushed work”, “Run provider CLI commands outside the Codex sandbox”, “Create a request on a supported provider”, “Fill the matching request template”, “Use standard sections without a request template”, and “Give recovery steps when provider access is unavailable”.

