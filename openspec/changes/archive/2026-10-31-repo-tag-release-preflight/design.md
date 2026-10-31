# Design: Add release preflight checks to repository tagging

## Approach

Extend the existing repository tag workflow. Preserve its clean-worktree gate, fetch, exact tag and target approval, tag ref validation, collision checks, tag creation, and push safeguards. Resolve the configured default branch from the remote's default-branch reference, require that branch to already be checked out, then update it with a fast-forward-only pull. Stop before any tag action if the default branch cannot be determined, the current branch differs, or the update fails.

Before proposing a tag, read the top versioned heading in the tracked root `CHANGELOG.md`. Require a corresponding preceding versioned heading with a matching `v<version>` tag to establish the review baseline. Compare the full diff from that prior tag to the updated default-branch commit with the top changelog entry; stop if changes are omitted. Require the top changelog version to match the release versions read from `package.json` and root `package-lock.json`. Require `v<version>` to be absent both locally and remotely. The explicit release-file list belongs in the `repo-tag` skill so new manifest formats require a reviewed workflow change.

If the root changelog is missing, offer the existing `$docs-changelog` workflow to create and prepare it, and stop this invocation without tagging. That workflow retains its separate approvals for the change set, entry text, version, and file creation.

## Files

- `codex/skills/repo-tag/SKILL.md` — add branch, changelog freshness, release-version, and matching-tag preflight gates.
- `openspec/specs/repository-commands/spec.md` — update the tag workflow requirement and scenarios.

## Trade-offs

Manual comparison of the release diff and changelog text keeps the workflow grounded in actual repository changes without introducing a changelog parser or a separate validation tool. An explicit release-file list avoids treating unrelated dependency versions as release versions.
