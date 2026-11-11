# Add a unified version bump workflow

## Why

The changelog workflow currently records a proposed version without updating the project's release manifests. A changelog entry for `0.3.0` was therefore committed while the npm manifests remained at `0.2.1`, and `repo-tag` correctly stopped on the mismatch.

## What Changes

- Add `$bump` and OpenCode `/bump` to select and apply one approved release version across the project's authoritative artifacts.
- Carry the tracked-change review, baseline, SemVer proposal, and approval safeguards from `docs-changelog` into `bump`.
- Update the changelog when it exists. If it is absent, offer to create it; declining creation still permits an approved manifest bump without changelog text.
- Remove the `$docs-changelog` skill and `/docs.changelog` command, and retire their changelog-only workflow specification.
- Ask in `repo-pr` whether a version bump is needed. A yes answer runs `bump` and stops PR preparation until the user commits, pushes, and reruns the PR workflow.
- Update the README and OpenCode plugin registration contract for the new command.

The separate command migration will delete `sync`, `trunk`, and `push`, and rename `branch`, `commit`, `pr`, and `tag` to remove their `repo-` prefixes. That migration will remove the old names without aliases and is not part of this change.

## Capabilities

### New Capabilities

- `release-version-bump`: Select, approve, and apply a release version consistently across supported project artifacts, with an optional changelog entry.

### Modified Capabilities

- `docs-commands`: Remove and retire the changelog-only command behavior, now provided by `release-version-bump`.
- `repository-commands`: Add the PR workflow's version-bump question and cross-host mapping for `bump`.
- `opencode-npm-plugin`: Register `bump` and remove `docs.changelog` from the plugin command/skill surface.
- `repository-documentation`: Update the README command and skill listings.

## Impact

The change affects `codex/skills/bump/`, `codex/skills/docs-changelog/`, `codex/skills/repo-pr/SKILL.md`, `opencode/commands/`, `opencode/index.ts`, the plugin registry tests, `scripts/check-package.js`, `README.md`, and the listed OpenSpec capabilities. Supported release artifacts are read from `package.json` and applicable lockfiles, `Cargo.toml` and workspace `Cargo.lock` entries, an applicable `herdr-plugin.toml`, or a Go release field established by project documentation or CI.

ASSUMPTION: A bump targets one release unit per invocation; if the repository contains multiple independently versioned release units and its configuration does not select one, the command stops without writing (untested — a supported project requiring one invocation to bump several independently released units would disprove this).

REJECTED-RISK: Declining creation of an absent CHANGELOG may leave bumped versions without new release notes — user chose to still bump manifests.

REJECTED-RISK: A yes response to the PR bump question interrupts PR preparation and requires commit/push and rerun — user chose this flow.
