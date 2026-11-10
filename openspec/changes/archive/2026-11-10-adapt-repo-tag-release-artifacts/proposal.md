# Adapt repository tagging to project release artifacts

## Why now

The `repo-tag` workflow currently requires `package.json` and `package-lock.json` to establish a release version. Projects that use other release formats stop at this check even when their authoritative version is recorded elsewhere.

## What changes

Make the workflow identify version-bearing release artifacts from the repository's ecosystem and documented release configuration. Validate the applicable authoritative version fields, including Rust `Cargo.toml`, Herdr `herdr-plugin.toml`, JavaScript or TypeScript package manifests, and project-documented Go release sources. Do not treat `go.mod`'s Go language version as the release version. Explain and stop when the source is unknown or ambiguous.

Make root `CHANGELOG.md` optional. When present, retain its current top-entry, previous-tag baseline, diff coverage, and version agreement checks. When absent, skip changelog-only checks and require a prior release tag and unambiguous release artifact evidence before proposing a new tag; otherwise explain what evidence is missing and stop. Preserve the clean default-branch update, exact tag and commit approval, collision checks, ref validation, and push safeguards.

Replace the remaining `TBD` purpose placeholders in the baseline OpenSpec specifications with concise descriptions derived from their existing requirements.

## Capabilities

Updates `repository-commands` release readiness behavior for `repo-tag` and OpenCode `/repo.tag`.

ASSUMPTION: A repository's Go release version can be read from a version file or release configuration only when repository documentation or CI establishes that source as authoritative (untested — a project with an authoritative source not referenced by documentation or CI would disprove this).

REJECTED-RISK: none.
