# Add the docs-changelog command

## Why now

The repository has working commands for Codex and OpenCode, while the README still says that no plugin implementation exists. A changelog command needs a clear, shared policy for deciding which repository changes it may summarize and how it obtains approval before recording a release entry.

## What changes

Add a Codex `docs-changelog` skill and an OpenCode `/docs.changelog` command. Both collect staged and unstaged tracked changes and commits since the changelog baseline, exclude untracked files, review the combined changes without counting staged and unstaged hunks twice, and propose concise Keep a Changelog entries under Added, Changed, and Fixed. They propose a SemVer version and require agreement on the included changes, entry text, and version before updating or creating `CHANGELOG.md`.

When no `CHANGELOG.md` exists, the command asks whether to create one and stops if the user declines. It uses `0.1.0` as the initial suggested version. If there is no changelog version or tag baseline, or a versioned header has no corresponding Git tag, it asks for a base commit. If there are no eligible changes, it reports that there is nothing to add and does not write an empty entry.

Update the README to describe the current Codex and OpenCode commands accurately. Create the initial root `CHANGELOG.md` during implementation, subject to the command's approval behavior and the factual repository history available at that time.

## Capabilities

### docs-changelog

Summarizes eligible tracked repository changes into an approved, versioned changelog entry.

### repository-documentation

Updates the README to reflect the current repository commands and implementation.

ASSUMPTION: command may read Git metadata and tracked contents only.

REJECTED-RISK: current untracked plugin files intentionally omitted.
