# Design: Unified version bump

## Approach

Add one `bump` workflow that reviews eligible tracked changes, identifies the release baseline, proposes a SemVer increment, and applies one approved version to the selected release unit. Keep the old changelog review safeguards: exclude untracked changes, avoid counting overlapping tracked diffs twice, propose factual Keep a Changelog sections without dates, and require approval of the change set, version, and exact entry before writing.

When a tracked root `CHANGELOG.md` has an untagged top version, accept it as a planned bump only when every authoritative manifest agrees with the immediately preceding changelog version, that preceding entry maps to a tag, and the top entry covers the full diff from that tag. Then propose aligning manifests to the top entry. If any condition fails, stop and ask the user to establish the base or provide evidence.

When recovering that verified planned bump, keep the existing top version heading and add the approved entry under it; do not create a duplicate heading.

When no root changelog exists, require all authoritative artifacts for the selected release unit to agree on a current version and require a matching prior release tag. Use that tag to collect commits and tracked working-tree changes. If either the agreed version or matching tag is missing, stop before proposing or writing a bump.

Update supported authoritative release fields for one release unit. For JavaScript and TypeScript, update root `package.json` and applicable present lockfile release fields. For Rust, update the package or inherited workspace version and applicable `herdr-plugin.toml`; when `Cargo.lock` contains the workspace package, use a Cargo-supported workspace-only operation and stop if the resulting change includes unrelated dependencies. For Go, update a safely writable release field only when project documentation or CI establishes it as authoritative. Stop on unknown or ambiguous sources. If multiple release units are not disambiguated by repository configuration, stop without edits.

If a changelog exists, include its exact entry in the approval request. If it is absent, ask whether to create it. A refusal omits changelog text but does not prevent an approved manifest bump. If an untracked file occupies the changelog path, stop without reading or overwriting it.

In `repo-pr`, ask about a bump only after the branch and provider checks make it ready for PR preparation. A no answer resumes the PR workflow. A yes answer invokes `$bump` and ends the PR workflow; the user must commit and push the changes, then invoke the PR workflow again.

## Files to change

- Create `codex/skills/bump/SKILL.md` with the release-baseline, artifact, approval, and no-write safeguards.
- Delete `codex/skills/docs-changelog/SKILL.md` after carrying its tracked-change and changelog behavior into the new skill.
- Modify `codex/skills/repo-pr/SKILL.md` to ask about a version bump and stop after invoking it.
- Create `opencode/commands/bump.md` as the OpenCode entry point for the `bump` skill.
- Delete `opencode/commands/docs.changelog.md`.
- Modify `opencode/index.ts` to register `/bump` and remove `/docs.changelog` and `docs-changelog`.
- Modify `test/plugin.test.ts` to verify the replacement command and skill mappings and eight-entry registry.
- Modify `scripts/check-package.js` to require the new bump files and no longer require the deleted changelog-only files.
- Modify `README.md` to list `/bump` and `$bump` and remove `/docs.changelog` and `$docs-changelog`.
- Update `openspec/specs/repository-commands/spec.md` for PR bump behavior and cross-host mapping.
- Update `openspec/specs/opencode-npm-plugin/spec.md` for the replacement registration.
- Update `openspec/specs/repository-documentation/spec.md` for the README inventory.
- Retire `openspec/specs/docs-commands/spec.md` after moving its ongoing behavior to `openspec/changes/add-unified-version-bump/specs/release-version-bump/spec.md`.

## Trade-offs

- The workflow supports only version sources already recognized by `repo-tag`; Go remains safe-stop unless repository evidence identifies a writable release field.
- An absent changelog is optional, so an approved manifest-only bump can leave the release without notes.
- The PR workflow intentionally stops after a requested bump because its changes make the branch dirty and unpushed.
- This change does not rename other repository commands. A separate migration will delete `sync`, `trunk`, and `push`, and rename `branch`, `commit`, `pr`, and `tag` to remove `repo-`, with no aliases.
