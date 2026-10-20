# GitHub Actions and npm distribution

## Why now

The repository already contains Codex skills and matching OpenCode command Markdown files. Packaging them as native OpenCode and Codex plugins lets users install the project through npm while keeping those existing files as the source of truth.

## What changes

Publish `@alexeyco/multitool` version `0.1.0` with an OpenCode v2 plugin entry and a Codex plugin manifest. OpenCode's `opencode/index.ts` registers all eight skills and commands through the plugin API, including the branch synchronization workflow. The Codex marketplace points to the same npm package and its manifest registers the existing `codex/skills/` directory. Both agents load the existing Markdown sources without manual copies.

Add GitHub Actions CI for pull requests and pushes to `master`, using Node.js 22, `npm ci`, `make check`, and `npm pack --dry-run`. Publish on pushed `v*` tags only after checking that the tag matches `package.json`, with npm provenance. Document plugin installation and maintainer release configuration. Review the complete eligible branch change set and propose the exact changelog entry under `0.1.0`; update `CHANGELOG.md` only after the user approves the change set, text, and version.

## Capabilities

### opencode-npm-plugin

Loads the existing repository skills and commands as a native OpenCode v2 plugin from npm, and installs the Codex skills from the same npm package through a Codex marketplace.

### github-release-pipeline

Validates pull requests and `master` updates, then publishes a version-matched public npm package with provenance for approved version tags.

### repository-documentation

Documents the installable package and the repository's defined validation and release workflows.

### docs-changelog

Records this branch's implemented changes under the already approved `0.1.0` version after obtaining the changelog workflow's required approval.

REJECTED-RISK: The release workflow does not publish from branches or pull requests; publishing requires a version-matched `v*` tag pointing to `master` and passing validation.
