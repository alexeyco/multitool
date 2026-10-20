# Design: Repository branch synchronization

## Approach

Add a `repo-sync` skill as the source of truth and a thin `/repo.sync` command that invokes it. Stop before fetching if the worktree is dirty or `HEAD` is detached. Determine the default branch from `origin/HEAD`, with `main` or `master` as documented fallbacks, then fetch without pruning.

Compare the current branch with `origin/<default>`. Fast-forward a branch that is behind only. Report branches that are already synchronized or ahead. For a diverged feature branch, explain merge and rebase effects, recommend a strategy using repository guidance and whether local commits are published, and wait for the user's exact choice and confirmation. Never merge or rebase a diverged default branch, resolve conflicts, switch branches, or push.

## Files to touch

- `codex/skills/repo-sync/SKILL.md` — define synchronization checks and safeguards.
- `opencode/commands/repo.sync.md` — invoke the matching skill.
- `opencode/index.ts` — register the skill and command.
- `test/plugin.test.ts` and `scripts/check-package.js` — validate mappings and package contents.
- `README.md` — link the new skill and command.
- `openspec/specs/repository-commands/spec.md` — add the implemented workflow to the baseline after completion.
- `CHANGELOG.md` — include the approved entry under `0.1.0` after exact text approval.

## Decisions and trade-offs

- Use fast-forward-only updates when no local commits need reconciliation.
- Ask the user to choose and confirm merge or rebase only when the feature branch has diverged. Rebase changes local commit IDs; merge preserves them.
- Do not update the baseline branch if it has diverged from its remote.
- Never switch branches, push, force-push, or resolve conflicts automatically.
