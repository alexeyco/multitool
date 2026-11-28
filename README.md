# multitool

![multitool — workflow skills for coding agents](docs/gallery/banner.svg)

A collection of agent skills for common repository workflows. Each skill is a
plain Markdown instruction file, portable across coding agents and installed
with the [skills](https://github.com/vercel-labs/skills) CLI.

## Install

Requires Node.js 22.20 or later. Run this from your project:

```sh
npx skills add alexeyco/multitool
```

Choose the skills and coding agents to install to. Skills are installed to the
current project by default; add `-g` to make them available across projects.

```sh
# List available skills without installing
npx skills add alexeyco/multitool --list
```

## Skills

In flow order:

- [mt-task-grill](skills/mt-task-grill/SKILL.md) — warm up a draft plan: interview, fill gaps, check test commands, approve.
- [mt-task-execute](skills/mt-task-execute/SKILL.md) — launch the ready wave: one herdr worktree and opencode agent per task.
- [mt-task-complete](skills/mt-task-complete/SKILL.md) — drive tasks to readiness: verify tests, commit, advance dependent waves, tear down.
- [mt-task-review](skills/mt-task-review/SKILL.md) — fresh read-only reviewer agent per task, fix loop until clean.
- [mt-task-ship](skills/mt-task-ship/SKILL.md) — per-task confirmed merges with post-merge tests, then a confirmed push.
- [mt-task-reflect](skills/mt-task-reflect/SKILL.md) — retrospective of the current orchestration session.

The execute, complete, and review skills control herdr and require a session
running inside it (`HERDR_ENV=1`).

See [AGENTS.md](AGENTS.md) for the repository map and guidance for contributors
and agents.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full license text.