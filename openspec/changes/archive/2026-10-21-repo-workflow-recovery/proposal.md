# Recover repository workflows

## Why now

The `repo-commit` workflow stops when a repository check fails, leaving the user to request a repair and another check run separately. In Codex, `repo-pr` runs provider CLI authentication checks in a sandbox where the user is not authenticated, so the workflow repeatedly reports an authentication failure.

## What changes

Update `repo-commit` to diagnose failed checks, keep fixing their causes safely, and rerun the checks until all pass before continuing commit preparation. If the cause cannot be fixed safely or required permissions or context are unavailable, report why and do not create a commit. Update `repo-pr` so only its provider CLI commands run outside the sandbox in Codex; retain the existing review and confirmation before request creation.

## Capabilities

### repository-commands

Improve check recovery in the commit workflow and run provider CLI commands outside the sandbox in the Codex pull request workflow.
