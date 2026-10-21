---
name: repo-pr
description: Prepare and create a pull request or merge request after provider, branch, and content checks.
---

# Create a pull or merge request

Prepare a request for the current branch. Creating it is an outward-facing
action and requires the user's confirmation.

## Procedure

In Codex, run provider CLI commands (`gh`, `glab`, or `tea`) outside the
sandbox whenever the workflow needs to check or use them. This includes
authentication checks and request creation. Run all non-provider commands,
including Git commands and CLI discovery with `command -v`, in the existing
execution context. Apply this rule only to this workflow.

1. Inspect `git status --short --branch` and `git remote -v`. Identify the
   provider from the remote: GitHub uses `gh`; GitLab, including self-hosted
   instances, uses `glab`; Codeberg, Forgejo, and Gitea (including instances
   identified by their domain or port 3000+) use `tea`.
2. Check that the corresponding CLI exists (`command -v <cli>`) and is
   authenticated (`gh auth status`, `glab auth status`, or the active `tea`
   login). If the provider is unsupported, the CLI is missing, or
   authentication fails, stop. Report what is installed/configured, give the
   exact provider-specific installation or login command when one applies, and
   give the manual web UI path. For an unsupported provider, state that no
   supported CLI installation or login command is available and give its web
   UI path instead. Do not claim that a request was created. Examples: `gh
   auth login`, `glab auth login`, and `tea login add`.
3. Determine the current source branch and repository default target using
   `git symbolic-ref refs/remotes/origin/HEAD` or provider data. If the current
   branch is the default branch, stop and ask the user to use a feature branch.
4. Ensure the branch is ready: uncommitted changes require `/repo.commit`;
   commits not pushed require `/repo.push`. Stop and report what remains. Do
   not create a request from a non-final state.
5. Review `git log <target>..<source> --oneline` and
   `git diff <target>...<source> --stat`. Draft a one-line title that states
   the change and follows repository history.
6. Look for the matching request template:
   - GitHub: `.github/PULL_REQUEST_TEMPLATE.md` (also inspect provider's
     applicable configured template when present).
   - GitLab: `.gitlab/merge_request_templates/`.
   - Forgejo: `.forgejo/pulls/`.
   - Gitea: `.gitea/pulls/`.

   Use the matching provider template and fill every section from the actual
   changes, leaving no placeholders. If no matching template exists, use
   `Summary`, `Changes`, and `Test plan`, with concrete content and verification
   commands or scenarios.
7. Present the host/provider, CLI, source-to-target branches, title, and full
   request body. Create the request only after the user confirms.
8. Create it with `gh pr create`, `glab mr create`, or `tea pulls create` and
   report the resulting URL. Do not add reviewers, milestones, or labels unless
   asked.

### Recovery commands and manual paths

- GitHub: if `gh` is missing, give an exact install command for an available
  package manager, such as `brew install gh` or `apt install gh`; then give
  `gh auth login`. Manual path: open the repository on GitHub and choose **Pull
  requests** → **New pull request**.
- GitLab: if `glab` is missing, give an exact install command for an available
  package manager, such as `brew install glab` or `apt install glab`; then give
  `glab auth login` and select the instance. Manual path: open the project on
  the detected GitLab instance and choose **Merge requests** → **New merge
  request**.
- Codeberg, Forgejo, or Gitea: if `tea` is missing, give an exact install
  command for an available package manager, such as `brew install tea` or
  `apt install tea`; then give `tea login add` with the detected instance URL
  and credentials. Manual path: open the repository on that instance and use
  its **Pull Requests** page to create a request.

Use the exact provider host detected from the remote when giving the manual
path. Do not guess credentials or state that a request exists before creation
succeeds.
