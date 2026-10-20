# multitool

![multitool — fast workflows for Codex and OpenCode](docs/gallery/banner.svg)

Registers eight OpenCode commands and distributes their matching Codex skills.
The source instructions remain in the Markdown files in this repository.

## Codex

### Install

Add the repository as a plugin marketplace, then install `multitool`:

```sh
codex plugin marketplace add alexeyco/multitool
codex plugin add multitool@multitool
```

Codex installs the packaged skills from the marketplace. Start a new Codex session to use them.

### Commands

- [`$repo-branch`](codex/skills/repo-branch/SKILL.md) — create an approved branch for the current task.
- [`$repo-commit`](codex/skills/repo-commit/SKILL.md) — review changes, run defined checks, and create confirmed commits.
- [`$repo-pr`](codex/skills/repo-pr/SKILL.md) — prepare and create a pull or merge request after confirmation.
- [`$repo-push`](codex/skills/repo-push/SKILL.md) — review and push commits after confirmation.
- [`$repo-sync`](codex/skills/repo-sync/SKILL.md) — synchronize the current branch with the default branch.
- [`$repo-trunk`](codex/skills/repo-trunk/SKILL.md) — update the default branch and review local cleanup candidates.
- [`$repo-tag`](codex/skills/repo-tag/SKILL.md) — create and push a tag after approval.
- [`$docs-changelog`](codex/skills/docs-changelog/SKILL.md) — review tracked changes and propose an approved changelog entry.

## OpenCode

### Install

Add the npm package to the `plugin` array in OpenCode's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@alexeyco/multitool"]
}
```

OpenCode installs the npm plugin and registers its commands and skills at startup.

### Commands

Commands use the `/tool.action` format:

- [`/repo.branch`](opencode/commands/repo.branch.md)
- [`/repo.commit`](opencode/commands/repo.commit.md)
- [`/repo.pr`](opencode/commands/repo.pr.md)
- [`/repo.push`](opencode/commands/repo.push.md)
- [`/repo.sync`](opencode/commands/repo.sync.md)
- [`/repo.trunk`](opencode/commands/repo.trunk.md)
- [`/repo.tag`](opencode/commands/repo.tag.md)
- [`/docs.changelog`](opencode/commands/docs.changelog.md)

See [AGENTS.md](AGENTS.md) for the repository map and guidance for contributors and agents.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full license text.
