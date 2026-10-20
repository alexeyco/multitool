## 1. Port workflow skills

- [x] 1.1 Add `codex/skills/repo-branch/SKILL.md` and preserve branch selection, current-HEAD safeguards, chosen-name approval, detached-HEAD stop, and agreed-base requirement; when no naming convention is documented, ask the user to choose a format and obtain separate approval before adding it to documentation.
- [x] 1.2 Add `codex/skills/repo-commit/SKILL.md` with inspection of staged diffs, unstaged diffs, and untracked contents; secret/junk exclusion reports; repository-defined checks with failure stop; logical commit grouping; explicit-path-only staging; and per-commit message/file-list confirmation.
- [x] 1.3 Add `codex/skills/repo-push/SKILL.md` with commit listing, missing-upstream setup, nothing-to-push stop, behind-upstream recovery, confirmation, and force-push prohibition absent an individual explicit request.
- [x] 1.4 Add `codex/skills/repo-pr/SKILL.md` with GitHub, GitLab, Forgejo, Codeberg/Gitea provider handling, default-branch and uncommitted/unpushed stops, CLI/auth gates, recovery commands, manual web path, and request confirmation; use and fill every section of a matching provider template, or use Summary, Changes, and Test plan when none exists.
- [x] 1.5 Add `codex/skills/repo-trunk/SKILL.md` with dirty-tree stop, default-branch selection, fetch/prune, fast-forward-only update and failure stop, and ahead/behind reporting.
- [x] 1.6 In `codex/skills/repo-trunk/SKILL.md`, specify prompt-gated local deletion, ordinary deletion for Git-merged branches, and `-D` eligibility only for provider-confirmed merged requests whose source head SHA exactly equals local HEAD; retain branches with missing or mismatched evidence and never delete remote branches.

## 2. Add OpenCode command mappings

- [x] 2.1 Add `opencode/commands/repo.branch.md` invoking `repo-branch`.
- [x] 2.2 Add `opencode/commands/repo.commit.md` invoking `repo-commit`.
- [x] 2.3 Add `opencode/commands/repo.trunk.md` invoking `repo-trunk`.
- [x] 2.4 Add `opencode/commands/repo.push.md` invoking `repo-push`.
- [x] 2.5 Add `opencode/commands/repo.pr.md` invoking `repo-pr`.

## 3. Verify workflow coverage

- [x] 3.1 Verify that Codex exposes all five hyphenated skill IDs and OpenCode maps `/repo.branch` to `repo-branch`, `/repo.commit` to `repo-commit`, `/repo.trunk` to `repo-trunk`, `/repo.push` to `repo-push`, and `/repo.pr` to `repo-pr`.
- [x] 3.2 Verify each skill against its source workflow safeguards, all stop and confirmation scenarios, and confirm trunk cleanup retains unverified or SHA-mismatched branches and never removes remote branches.
- [x] 3.3 Verify branch naming asks the user to choose a format when documentation has none and asks separately before writing the chosen convention into documentation.
- [x] 3.4 Verify commit review inspects staged, unstaged, and untracked contents and stages only explicit reviewed paths.
- [x] 3.5 Verify pull request handling includes Forgejo and fills every section in matching GitHub/GitLab/Forgejo/Gitea templates, with Summary, Changes, and Test plan as the no-template fallback.
