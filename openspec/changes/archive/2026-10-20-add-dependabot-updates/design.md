# Design: Add Dependabot updates

## Approach

Add `.github/dependabot.yml` with weekly update entries for the npm ecosystem rooted at `/` and the GitHub Actions ecosystem rooted at `/`. Configure an update group in each ecosystem so updates are grouped by ecosystem and remain separate from the other ecosystem. Update `.github/workflows/ci.yml` to run `npm run typecheck` as part of pull request and `master` validation.

## Files to touch

- `.github/dependabot.yml` — define weekly npm and GitHub Actions update schedules and one grouping rule per ecosystem.
- `.github/workflows/ci.yml` — run the package typecheck script in CI.

## Data and behavior

Dependabot configuration uses GitHub's YAML format. Both ecosystem entries use a weekly interval and `/` directory. CI uses the existing `typecheck` npm script and retains `npm ci`, `make check`, and `npm pack --dry-run`.

## Trade-offs

Grouping by ecosystem keeps npm package updates distinct from workflow action updates while reducing the number of update pull requests within each ecosystem.
