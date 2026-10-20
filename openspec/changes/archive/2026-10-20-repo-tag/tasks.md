## 1. Add the Codex tag workflow

- [x] 1.1 Add `codex/skills/repo-tag/SKILL.md` with the clean-worktree stop, `origin` fetch, `master` switch and fast-forward-only update, and stop on update failure; cover scenarios “Stop on a dirty worktree”, “Update master with fast-forward only”, and “Stop when master cannot fast-forward”.
- [x] 1.2 In `codex/skills/repo-tag/SKILL.md`, derive the tag candidate only from tag history or `CONTRIBUTING.md`, ask for the exact tag when no convention exists, validate it with `git check-ref-format`, check local and remote tag collisions, present the exact tag and full target SHA, obtain approval before creating and pushing, and prohibit overwrite; cover “Ask for a tag when no convention is available”, “Approve an exact tag and target”, “Stop when the tag name already exists”, and “Stop after a policy-rejected tag push”.

## 2. Add the OpenCode command and mapping

- [x] 2.1 Add `opencode/commands/repo.tag.md` as a thin command invoking `repo-tag` with arguments unchanged; cover “Invoke the tag workflow on either host”.
- [x] 2.2 Update `openspec/specs/repository-commands/spec.md` with the repository tag workflow requirement and the `/repo.tag` to `repo-tag` mapping; preserve the existing mapping scenario and add the tag mapping scenario.
- [x] 2.3 Update `README.md` to list the new skill and command with links to `codex/skills/repo-tag/SKILL.md` and `opencode/commands/repo.tag.md`.

## 3. Verify tag workflow coverage

- [x] 3.1 Check all repository tag workflow scenarios against `codex/skills/repo-tag/SKILL.md`, confirming clean-worktree enforcement, fast-forward-only master update, candidate evidence sources, collision checks, exact-target approval, and no tag overwrite.
- [x] 3.2 Check that `opencode/commands/repo.tag.md` delegates to `repo-tag` and that README and `openspec/specs/repository-commands/spec.md` name the same skill-command mapping.
