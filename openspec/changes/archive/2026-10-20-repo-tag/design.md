# Design: Add repository tag workflow

## Approach

Add `repo-tag` as the sixth repository skill. The OpenCode `/repo.tag` command remains a thin invocation of that skill. Keep the workflow safeguards in the Codex skill and extend the repository-commands baseline requirement and mapping in the same change.

The skill first inspects `git status --short --branch` and stops on any tracked or untracked changes. When clean, it fetches from `origin`, switches to `master`, and updates `master` with `git pull --ff-only`. It stops if the fast-forward update fails. It examines existing Git tag names and `CONTRIBUTING.md` for a version convention. It does not use the changelog to invent a tag. If neither source establishes a convention, it asks the user to provide the exact tag, then validates the exact ref name with `git check-ref-format` before proceeding.

Before creating a tag, the skill checks for the exact local ref and queries `origin` for the exact remote tag name. It presents the exact tag and updated `master` commit SHA, then waits for approval that covers both tag creation and push. It creates an annotated tag at that commit and pushes that exact tag to `origin`. It never force-pushes tags. If tag protection or repository policy rejects the push, it reports the rejection and stops without retrying or changing the approved tag or target.

## Files

- `codex/skills/repo-tag/SKILL.md` — clean-worktree gate, `master` update, candidate selection, collision checks, approval, and tag push.
- `opencode/commands/repo.tag.md` — invoke the `repo-tag` skill with arguments unchanged.
- `openspec/specs/repository-commands/spec.md` — add the tag workflow requirement and extend the cross-host mapping.
- `README.md` — list the new skill and OpenCode command with links to their files.

## Data and safeguards

The proposed tag is a single exact Git ref name. The target is the full commit SHA of updated `master`. Approval applies to that exact tag and SHA; any change to either requires renewed approval. Local or remote name collisions stop the workflow. The push command targets only the approved tag ref and does not use force options.

## Trade-offs

An annotated tag is the default when the repository has no tag-object convention, so the tag records a release message and target. The approval gate keeps this default reviewable before any ref is created or pushed.
