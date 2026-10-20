## 1. Configure weekly Dependabot updates

- [x] 1.1 Add `.github/dependabot.yml` with weekly npm updates from the root manifest and lockfile, grouped for the npm ecosystem; cover scenarios “Check npm dependencies weekly” and “Group npm dependency updates”.
- [x] 1.2 Configure weekly GitHub Actions updates with `directory: /` so Dependabot scans workflows under `.github/workflows/`, grouped separately for that ecosystem; cover scenarios “Check GitHub Actions weekly” and “Group GitHub Actions updates separately”.
- [x] 1.3 Verify `.github/dependabot.yml` defines weekly schedules for both ecosystems, uses `directory: /` for both entries, scans workflows under `.github/workflows/` for GitHub Actions, and keeps each ecosystem's updates in its own group.

## 2. Validate dependency update pull requests

- [x] 2.1 Update `.github/workflows/ci.yml` to run `npm run typecheck` on pull requests and pushes to `master`, retaining `npm ci`, `make check`, and `npm pack --dry-run`; cover scenarios “Validate a pull request”, “Validate a master push”, and “Fail CI when CI package validation fails”.
- [x] 2.2 Verify `.github/workflows/publish.yml` retains its existing `npm ci`, `make check`, and `npm pack --dry-run` gates before publishing; confirm this workflow remains independent of the CI typecheck check.
