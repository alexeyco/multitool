# Design: Repository workflow recovery

## Approach

Keep the Codex skills as the workflow source of truth. Change `repo-commit` so a failed defined check leads to diagnosis, a safe repair, and a rerun of the checks. Continue diagnosing and repairing safely, then rerun checks until all defined checks pass. Stop and report the failure without creating a commit only when the cause cannot be fixed safely or required permissions or context are unavailable. Preserve staged path review and individual confirmation for every commit.

Change `repo-pr` so provider CLI commands (`gh`, `glab`, and `tea`) run outside the sandbox in Codex. Keep non-provider commands within the existing execution context. Preserve provider detection, branch readiness checks, request review, and user confirmation before creation. The OpenCode command remains a thin delegate to the skill.

## Files to touch

- `codex/skills/repo-commit/SKILL.md` — define safe repair and check retry behavior while preserving commit safeguards.
- `codex/skills/repo-pr/SKILL.md` — run provider CLI commands outside the sandbox in Codex while preserving request confirmation.
- `openspec/specs/repository-commands/spec.md` — update the commit and pull request workflow requirements.

## Decisions and trade-offs

- Continue safe repair and check retries until all checks pass; stop without creating a commit only when a safe repair or required permissions/context are unavailable.
- Restrict out-of-sandbox execution to provider CLI commands in `repo-pr` under Codex.
- Keep the existing user confirmation before each commit and before pull or merge request creation.
