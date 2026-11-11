## 1. Implement release baseline and version selection

- [x] 1.1 Create `codex/skills/bump/SKILL.md` with tracked-change review, tag baseline lookup, SemVer selection, approval, and safe-stop behavior for these scenarios: `Review tracked changes from a tagged changelog baseline`; `Use an untagged changelog entry as the planned bump`; `Select a baseline when the changelog is absent`; `Stop when a changelog-free baseline is unavailable`; `Stop when an untagged changelog baseline is unverified`; `Ask for a baseline on an initial release`; `Stop when there are no eligible changes`; `Stop when multiple release units are ambiguous`. When recovering an existing untagged top changelog entry, update that entry without adding a duplicate version heading.
- [x] 1.2 In `codex/skills/bump/SKILL.md`, specify minor bumps for added functionality, patch bumps for compatible changes and fixes, major bumps only for clearly documented breaking changes, and ask when ambiguous.

## 2. Update supported release artifacts

- [x] 2.1 Implement authoritative artifact discovery and aligned version writes in `codex/skills/bump/SKILL.md` for these scenarios: `Update JavaScript or TypeScript release artifacts`; `Update a Rust workspace release version`; `Align an applicable Herdr release manifest`; `Stop if Cargo would change unrelated dependencies`; `Update a documented Go release version source`; `Do not use the Go language version as a release version`; `Stop when the release version source is unknown or ambiguous`.
- [x] 2.2 Define the one-release-unit boundary and stop before partial edits in `codex/skills/bump/SKILL.md` whenever artifact authority is unknown, ambiguous, or cannot be updated without unrelated dependency changes.

## 3. Integrate changelog and approval behavior

- [x] 3.1 Complete `codex/skills/bump/SKILL.md` changelog handling and approval gates for these scenarios: `Prepare an entry for an existing changelog`; `Offer to create a missing changelog`; `Continue a manifest bump when changelog creation is declined`; `Avoid overwriting an untracked changelog`; `Leave files unchanged when the bump is not approved`; `Leave changelog unchanged when its entry is not approved`; `Do not commit, push, or tag`.
- [x] 3.2 Delete `codex/skills/docs-changelog/SKILL.md` after its maintained behavior is represented by `codex/skills/bump/SKILL.md`.
- [x] 3.3 Delete `opencode/commands/docs.changelog.md` and create `opencode/commands/bump.md` as a thin invocation of the `bump` skill.

## 4. Integrate the PR bump question

- [x] 4.1 Modify `codex/skills/repo-pr/SKILL.md` to implement these scenarios: `Ask whether a version bump is needed`; `Continue PR preparation when no bump is needed`; `Run bump and stop PR preparation when a bump is needed`.

## 5. Update plugin registration and README

- [x] 5.1 Modify `opencode/index.ts`, `test/plugin.test.ts`, and `scripts/check-package.js` to replace `docs-changelog` and `/docs.changelog` with `bump` and `/bump`, satisfying `Invoke a workflow on either host`, `Invoke the tag workflow on either host`, `Invoke the version bump workflow on either host`, `Install skills in Codex`, `Register the existing command set`, `Register bundled skills from their source files`, `Invoke the matching skill from a command`, `Forward command arguments and attachments unchanged`, `Refresh plugin-provided skills and commands`, `Preserve the existing workflow content`, `Verify the plugin registry and package contents`, and `Run the project check`.
- [x] 5.2 Modify `README.md` to list the current bump skill and command and remove the changelog-only command and skill, satisfying `Reader checks the repository status`, `Reader installs the npm plugin`, and `Reader checks CI and release behavior`.
- [x] 5.3 Remove the retired changelog-only command offer from `codex/skills/repo-tag/SKILL.md` and update the corresponding repository-command contract.

## 6. Update OpenSpec contracts

- [x] 6.1 Add `openspec/changes/add-unified-version-bump/specs/release-version-bump/spec.md` as the contract for all release-baseline, artifact, and changelog scenarios implemented in groups 1–3.
- [x] 6.2 Add `openspec/changes/add-unified-version-bump/specs/repository-commands/spec.md` with the exact modified requirement headers and scenarios `Stop when on the default branch`, `Stop with uncommitted or unpushed work`, `Run provider CLI commands outside the Codex sandbox`, `Do not retry provider authentication in the sandbox`, `Ask whether a version bump is needed`, `Continue PR preparation when no bump is needed`, `Run bump and stop PR preparation when a bump is needed`, `Create a request on a supported provider`, `Fill the matching request template`, `Use standard sections without a request template`, `Give recovery steps when provider access is unavailable`, `Invoke a workflow on either host`, `Invoke the tag workflow on either host`, and `Invoke the version bump workflow on either host`.
- [x] 6.3 Add `openspec/changes/add-unified-version-bump/specs/opencode-npm-plugin/spec.md` and `openspec/changes/add-unified-version-bump/specs/repository-documentation/spec.md` with their exact modified baseline requirement headers and all scenarios listed in those delta specs.
- [x] 6.4 Mark `openspec/changes/add-unified-version-bump/.openspec.yaml` to retire `docs-commands`, and record its five removed requirement headers, all twelve scenario headings, and migration guidance in `openspec/changes/add-unified-version-bump/specs/docs-commands/spec.md`: `Review working tree and commits`; `No eligible changes exist`; `Summarize eligible changes`; `Select the initial version`; `Resolve an untagged version header`; `User approves the proposal`; `User does not approve the proposal`; `User permits initial changelog creation`; `User declines initial changelog creation`; `Propose the implemented plugin and workflow under 0.1.0`; `Write the approved 0.1.0 branch entry`; `Do not write an unapproved branch entry`.
