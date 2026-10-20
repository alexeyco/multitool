# Synchronize a branch with the default branch

## Why now

The repository can create branches, update the default branch, and push commits, but it has no focused workflow for bringing the current feature branch up to date with the default branch.

## What changes

Add the `repo-sync` Codex skill and `/repo.sync` OpenCode command. The workflow checks the worktree and default branch, fetches remote refs, fast-forwards when possible, and asks for an approved merge or rebase strategy when the feature branch has diverged. It never switches branches or pushes.

## Capabilities

### repository-sync

Safely synchronize the current branch with the repository's default branch.
