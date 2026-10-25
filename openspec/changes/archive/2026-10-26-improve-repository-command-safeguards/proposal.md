# Improve repository command safeguards

## Why now

The repository workflows still leave users to repeat known branch naming rules, can handle provider authentication in the wrong execution context, and do not recover when a protected branch rejects a push. The commit workflow also needs to surface unarchived OpenSpec work before it creates a commit.

## What changes

Update the pull request workflow to use branch naming guidance from `CONTRIBUTING.md` and keep provider CLI calls in the authenticated host context without retrying in the Codex sandbox. Update the push workflow to offer a confirmed local branch creation after a policy rejection, then require separate confirmation before pushing that branch. Update the commit workflow to ask whether to commit or archive first whenever non-archived change directories exist under `openspec/changes/`, and to confirm before committing on the default branch. If the user declines, propose and create an approved branch that follows repository naming rules, then continue on that branch.

## Capabilities

### repository-commands

Improve the repository pull request, push, and commit workflows while preserving their existing review and confirmation safeguards.
