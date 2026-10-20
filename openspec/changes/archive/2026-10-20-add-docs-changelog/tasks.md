## 1. Add the shared changelog workflow

- [x] 1.1 Define the shared collection, baseline, proposal, approval, and missing-file behavior in `codex/skills/docs-changelog/SKILL.md`. Covers scenarios “Review working tree and commits”, “No eligible changes exist”, “Summarize eligible changes”, “Select the initial version”, “Resolve an untagged version header”, “User approves the proposal”, “User does not approve the proposal”, “User permits initial changelog creation”, and “User declines initial changelog creation”.
- [x] 1.2 Add `opencode/commands/docs.changelog.md` with the same behavior as the Codex skill. Covers scenarios “Review working tree and commits”, “No eligible changes exist”, “Summarize eligible changes”, “Select the initial version”, “Resolve an untagged version header”, “User approves the proposal”, “User does not approve the proposal”, “User permits initial changelog creation”, and “User declines initial changelog creation”.

## 2. Document current project commands and history

- [x] 2.1 Update the README to accurately describe the current repository status, existing files, and Codex/OpenCode commands. Covers scenario “Reader checks the repository status”.
- [x] 2.2 Create the initial root `CHANGELOG.md` with a factual, approved entry based on the selected base commit and eligible tracked history. Covers scenarios “Review working tree and commits”, “Summarize eligible changes”, and “User approves the proposal”.
