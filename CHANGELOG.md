# Changelog

## 0.1.1

### Added

- Added weekly Dependabot updates for npm dependencies.

### Changed

- Updated npm development dependencies.
- Updated the Codex pull request workflow to run provider CLI commands outside the sandbox.

### Fixed

- Updated the commit workflow to repair failed checks and rerun them until all checks pass.

## 0.1.0

### Added

- Added Codex skills and matching OpenCode commands for branch, commit, pull request, push, sync, trunk, tag, and changelog workflows.
- Added contributor and agent guidance, a project banner, and OpenSpec specifications for repository workflows and documentation.
- Added the `@alexeyco/multitool` OpenCode plugin, which registers the existing commands and skills from the npm package without copying files.
- Added GitHub Actions checks for pull requests and `master`, plus version- and ancestry-validated npm publishing with provenance.
- Added a Codex plugin manifest and npm-backed marketplace entry to install all eight skills without copying files.
- Added a repository synchronization workflow that fast-forwards when possible and asks before merging or rebasing a diverged feature branch.

### Changed

- Expanded the README with separate Codex and OpenCode installation and command sections.
