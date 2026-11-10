# Design: Adapt repository tag release artifacts

## Approach

Keep artifact selection and validation in the `repo-tag` workflow. Inspect project manifests, release configuration, documentation, and CI to identify the project's ecosystem and authoritative release version source. Validate all related version fields that represent the package or release version. For JavaScript package-lock files, preserve the existing root package version checks. For Rust, use the package version in `Cargo.toml`; when the project also has a Herdr plugin manifest, validate its release version against the Rust package version. For Go, accept only a release version source that project documentation or CI identifies as authoritative; `go.mod`'s language version is not a release version.

If the workflow finds no authoritative source or finds conflicting candidate sources, report the paths and values and stop before proposing a tag. Keep the existing changelog review unchanged when the root `CHANGELOG.md` exists. If it is absent, use the repository's release tag history to establish a previous-tag baseline and skip only checks that require changelog content. Stop when no baseline can be established.

## Files

- `codex/skills/repo-tag/SKILL.md` — replace the fixed npm manifest list with ecosystem-aware artifact discovery and make changelog checks conditional on the tracked root file's presence.
- `openspec/specs/repository-commands/spec.md` — update the repository tag workflow contract and add ecosystem, ambiguity, optional-changelog, and version-source scenarios.

## Trade-offs

Project evidence is used to distinguish release versions from unrelated version fields. The workflow stops when that evidence does not identify one authoritative source, which avoids guessing from dependency versions or Go language versions. Without a changelog, tag history can establish the comparison baseline, but the workflow cannot validate release-note completeness.

Replace each remaining baseline specification purpose placeholder with a concise statement that summarizes only the requirements already present in that specification. The cleanup is limited to these files:

- `openspec/specs/repository-documentation/spec.md`
- `openspec/specs/github-release-pipeline/spec.md`
- `openspec/specs/opencode-npm-plugin/spec.md`
- `openspec/specs/repository-commands/spec.md`
