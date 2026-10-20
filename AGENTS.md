# multitool

Repo guide for AI agents working on this project.
Human-facing docs: [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md),
and [CHANGELOG.md](CHANGELOG.md).

## Conventions

- Keep repository documentation in English and describe only verified behavior.
- `codex/skills/<skill-id>/SKILL.md` is the source of truth for each workflow.
- OpenCode commands live in `opencode/commands/<tool>.<action>.md` and invoke
  their matching Codex skill.
- Keep OpenCode commands thin; put workflow safeguards in the skill.
- Treat OpenSpec specs as the behavior contract. Keep change artifacts under
  `openspec/changes/` and baseline capabilities under `openspec/specs/`.
- Changelog entries include only reviewed tracked changes. Exclude untracked
  files and obtain approval for the change set, entry text, and version before
  writing.
- Never stage, commit, or push unless the user explicitly asks and approves the specific action.

## Repository contents

- `codex/skills/` contains Codex skill instructions.
- `opencode/commands/` contains OpenCode command definitions.
- `openspec/specs/` contains baseline specifications.
- `openspec/changes/archive/` contains completed and archived changes.
- `CONTRIBUTING.md` describes contribution expectations.
- `CHANGELOG.md` records approved tracked changes by version.
- `LICENSE` contains the MIT License.
