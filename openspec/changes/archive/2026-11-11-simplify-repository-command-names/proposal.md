# Simplify repository command names

## Why now

Repository workflows currently expose seven commands with a `repo-`/`repo.` naming prefix and one unprefixed `bump` workflow, for eight commands total. This change completes the agreed command-interface simplification and removes three workflows that will no longer be part of the supported interface.

## What changes

Rename the retained branch, commit, PR, and tag workflows to `branch`, `commit`, `pr`, and `tag`. Preserve the `bump` workflow behavior and skill ID while namespacing its invocations. Codex invocations use `$multitool:<action>` and OpenCode commands use `/multitool.<action>` for all five retained actions. Remove `sync`, `trunk`, and `push` workflows, their commands, and references to their old invocations. Update the plugin inventory, tests, README, and affected capability specifications. `$multitool:pr` will direct users to `$multitool:commit` and manual `git push` where appropriate.

## Impact

This changes the `repository-commands`, `opencode-npm-plugin`, `repository-documentation`, and `release-version-bump` capabilities. The supported command set becomes exactly five Codex skills and five OpenCode commands. Retained workflow behavior and safeguards, including bump and release-tag semantics, remain unchanged apart from names and necessary cross-references.

ASSUMPTION: The confirmed naming map is Codex `$multitool:branch`, `$multitool:commit`, `$multitool:pr`, `$multitool:tag`, and `$multitool:bump`, with OpenCode `/multitool.branch`, `/multitool.commit`, `/multitool.pr`, `/multitool.tag`, and `/multitool.bump`.

REJECTED-RISK: Existing `$repo-*` and `/repo.*` invocations will stop working; no compatibility aliases will be kept.

REJECTED-RISK: Removing `sync` and `trunk` removes their synchronization, default-branch update, and local branch cleanup functionality.

REJECTED-RISK: Removing `push` removes its guarded push and policy-rejection recovery workflow; users will use manual `git push` as directed by `$multitool:pr`.
