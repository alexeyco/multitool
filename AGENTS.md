# multitool

Repo guide for AI agents working on this project.
Human-facing docs: [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md),
and [CHANGELOG.md](CHANGELOG.md).

## Conventions

- Keep repository documentation in English and describe only verified behavior.
- `skills/<skill-id>/SKILL.md` is the source of truth for each workflow. Keep
  its YAML frontmatter (`name`, `description`) valid for the skills CLI.
- Skills are distributed with `npx skills add alexeyco/multitool`; keep them
  harness-agnostic and free of plugin or command infrastructure.
- Changelog entries include only reviewed tracked changes. Exclude untracked
  files and obtain approval for the change set, entry text, and version before
  writing.
- Never stage, commit, or push unless the user explicitly asks and approves the specific action.

## Repository contents

- Workflow skills live in `skills/<skill-id>/SKILL.md`.
- `CONTRIBUTING.md` describes contribution expectations.
- `CHANGELOG.md` records approved tracked changes by version.
- `LICENSE` contains the MIT License.
