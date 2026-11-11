# Design

## Approach

Rename the four retained `repo-*` Codex skill directories and their OpenCode command files to the unprefixed skill IDs and namespaced command names. Keep the Codex bump skill ID as `bump`, but rename its OpenCode command to `multitool.bump`. Codex invocations use `$multitool:<action>` and OpenCode command names use `/multitool.<action>` for all five retained actions. Remove the `repo-sync`, `repo-trunk`, and `repo-push` skill directories and their OpenCode command files. Update the static command/skill registry, registry tests, package inventory, README, retained workflow cross-references, and capability specs. Do not alter the retained workflow safeguards or release behavior.

## Files to touch

- `codex/skills/repo-branch/SKILL.md` → `codex/skills/branch/SKILL.md`
- `codex/skills/repo-commit/SKILL.md` → `codex/skills/commit/SKILL.md`
- `codex/skills/repo-pr/SKILL.md` → `codex/skills/pr/SKILL.md`
- `codex/skills/repo-tag/SKILL.md` → `codex/skills/tag/SKILL.md`
- `codex/skills/bump/SKILL.md`
- `codex/skills/repo-push/SKILL.md` (remove)
- `codex/skills/repo-sync/SKILL.md` (remove)
- `codex/skills/repo-trunk/SKILL.md` (remove)
- `opencode/commands/repo.branch.md` → `opencode/commands/multitool.branch.md`
- `opencode/commands/repo.commit.md` → `opencode/commands/multitool.commit.md`
- `opencode/commands/repo.pr.md` → `opencode/commands/multitool.pr.md`
- `opencode/commands/repo.tag.md` → `opencode/commands/multitool.tag.md`
- `opencode/commands/bump.md` → `opencode/commands/multitool.bump.md`
- `opencode/commands/repo.push.md` (remove)
- `opencode/commands/repo.sync.md` (remove)
- `opencode/commands/repo.trunk.md` (remove)
- `opencode/index.ts`
- `test/plugin.test.ts`
- `scripts/check-package.js`
- `README.md`
- `openspec/specs/repository-commands/spec.md`
- `openspec/specs/opencode-npm-plugin/spec.md`
- `openspec/specs/repository-documentation/spec.md`
- `openspec/specs/release-version-bump/spec.md`
- `openspec/changes/simplify-repository-command-names/specs/release-version-bump/spec.md`

The PR workflow cross-references `$multitool:commit` and manual `git push`; after a bump it directs users to commit, manually push, then rerun `$multitool:pr`. The commit workflow's self-reference changes to `$multitool:commit`. OpenCode `/multitool.<action>` commands map to their matching unprefixed skill IDs. The package inventory and executable checks expect exactly five commands and five skills and reject removed IDs and aliases.

## Validation

Run `npm ci`, `make check`, `npm run typecheck`, `npm pack --dry-run`, and strict OpenSpec validation. These checks cover dependency installation, plugin registration and package contents, typing, pack contents, and specification structure.
