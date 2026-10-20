## 1. Synchronization workflow

- [x] 1.1 Add the `repo-sync` Codex skill with worktree, branch, fetch, divergence, confirmation, and conflict safeguards. Covers all repository-sync scenarios.
- [x] 1.2 Add `/repo.sync` OpenCode command and register it with the matching skill. Covers scenarios “Fast-forward a branch that is behind only” and “Do not switch branches or push”.
- [x] 1.3 Extend plugin tests and package inventory checks for the new mapping and files. Covers scenario “Verify the plugin registry and package contents”.

## 2. Documentation and release record

- [x] 2.1 Add links to `$repo-sync` and `/repo.sync` in the README. Covers scenario “Reader finds the synchronization workflow”.
- [x] 2.2 Review the full eligible branch change set and obtain approval for the exact `0.1.0` changelog entry before updating `CHANGELOG.md`. Covers scenarios “Propose the implemented workflow under 0.1.0” and “Write the approved entry”.
