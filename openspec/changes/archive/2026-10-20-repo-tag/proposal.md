# Add repository tag workflow

## Why now

The five existing repository workflows cover branching, commits, trunk maintenance, pushes, and pull requests, but they do not provide a guarded release-tag workflow.

## What changes

Add a Codex `$repo-tag` skill and an OpenCode `/repo.tag` command that delegates to it. The workflow requires a clean worktree, updates `master` with a fast-forward-only pull, and derives a candidate tag only from existing tag history or `CONTRIBUTING.md`. When neither source establishes a convention, it asks the user for the exact tag. Before creating or pushing a tag, it presents the exact tag and target commit and obtains approval. It never guesses a version or overwrites an existing remote tag.

## Capabilities

Extends the `repository-commands` capability with a tag workflow and its Codex/OpenCode mapping.

## Scope

This change adds only the tag skill, its thin OpenCode command, the skill/command mapping, and the corresponding repository-commands specification update. It does not edit the changelog, create commits or pull requests, or delete branches.

ASSUMPTION: Use `origin` and the existing repo-trunk fetch, switch, and `pull --ff-only` sequence to update `master` (untested — a repository convention requiring another remote would disprove this).

ASSUMPTION: Create an annotated tag when no existing tag establishes a tag-object convention (untested — an established project convention requiring lightweight tags would disprove this).

REJECTED-RISK: none.
