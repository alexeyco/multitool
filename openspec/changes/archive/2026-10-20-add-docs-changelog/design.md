# Design: docs-changelog

## Approach

Provide one changelog workflow through two host-specific entry points: the Codex `docs-changelog` skill and OpenCode `/docs.changelog` command. Each entry point follows the same eligibility, baseline, proposal, and approval rules. It reads Git metadata and tracked file contents to build the review set, then writes the changelog only after approval.

The existing `repository-documentation` capability supplies the README baseline. This change modifies its current-state requirement to include the verified Codex and OpenCode commands. The new `docs-changelog` capability owns changelog collection, version selection, entry format, and write approval.

## Files to touch

- `README.md` — correct the repository status and document current Codex and OpenCode commands.
- `CHANGELOG.md` — create the initial root changelog during implementation after the workflow confirms creation and receives approval for an entry.
- `codex/skills/docs-changelog/SKILL.md` — define the Codex command behavior.
- `opencode/commands/docs.changelog.md` — define the OpenCode command behavior.

## Decisions and trade-offs

- Include staged and unstaged tracked changes and commits after the selected baseline; exclude untracked files entirely.
- Review one combined change set and avoid counting the same staged and unstaged hunks twice.
- Use Keep a Changelog headings Added, Changed, and Fixed, with concise factual prose and no dates.
- Suggest `0.1.0` when there is no changelog version or tag baseline; ask the user for a base commit when a baseline is missing or a versioned header has no matching tag.
- Require agreement on the changes, text, and version before writing. Ask before creating a missing root changelog and stop on refusal.
- Do not include `repo.tag` in this change.
