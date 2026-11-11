---
name: bump
description: Review a release baseline and prepare an approved version bump.
---

# Bump the release version

Invoke this workflow as `$multitool:bump` in Codex or `/multitool.bump` in
OpenCode.

Review one release unit, establish a verified baseline, and propose a SemVer
version. Do not write release artifacts until the user approves the reviewed
change set and proposed version. When a changelog entry is required, also
obtain approval of its exact text before writing.

## Establish the release unit and baseline

1. Inspect repository status, current branch, tracked release documentation,
   manifests, release configuration, and Git tag history. Do not read
   untracked file contents or include untracked changes in the proposal.
2. Identify the release unit and its authoritative version artifacts from
   repository conventions. Do not treat dependency versions, language
   versions, or unrelated package versions as release versions. If repository
   configuration does not select one unit and multiple independently
   versioned units are candidates, report their paths and versions, ask the
   user to select a unit, and stop without proposing or writing a version.
3. If a tracked root `CHANGELOG.md` has a versioned top entry associated
   unambiguously with a release tag, use that tag as the baseline. Accept the
   repository's established tag spelling, including `v` prefixes where tag
   history demonstrates that convention. Review commits after the baseline
   and the aggregate staged and unstaged diff of tracked files. Inspect
   staged and unstaged diffs as needed, but use the aggregate tracked
   working-tree diff as the final state so overlapping hunks are counted
   once. Combine it with the baseline-to-`HEAD` commit changes. Exclude
   untracked files.
4. If the tracked changelog's top version is untagged, treat it as a planned
   bump only when all authoritative manifests agree with the immediately
   preceding changelog version, that preceding version has a matching tag,
   and the top entry covers the full diff since that tag. Compare the entry
   against both commits since the tag and tracked working-tree changes. If
   any condition fails, report the missing or conflicting evidence and ask
   the user to establish or select a baseline; do not write files. When this
   planned bump is verified, propose aligning manifests to the existing top
   version and update that entry in place. Never add a duplicate version
   heading.
5. If the tracked root changelog is absent, establish the current release
   version from all authoritative artifacts for the selected unit. Require
   them to agree and require a matching prior release tag. Use that tag as
   the baseline, review commits since it and the aggregate staged and
   unstaged tracked diff, and exclude untracked files. If the artifacts
   conflict or no matching tag can be established, report the evidence and
   stop before proposing or writing a bump.
6. If there is no versioned changelog entry and no tagged release baseline,
   report that this is an initial release, suggest `0.1.0`, and ask the user
   to select a base commit. Do not proceed until the user selects or approves
   the base commit. Do not silently substitute another tag or `HEAD`.
7. If the selected baseline has no eligible commits or tracked working-tree
   changes, report that there is nothing to bump and stop without writing
   files.

## Review changes and propose a version

1. Summarize only eligible changes since the selected baseline. State the
   baseline tag or commit, included commits and tracked working-tree changes,
   and excluded untracked files. Keep the summary factual and avoid counting
   overlapping staged and unstaged hunks twice.
2. Propose a minor increment for added functionality, a patch increment for
   compatible changes or fixes, and a major increment only for clearly
   documented breaking changes. If impact or the next version is ambiguous,
   explain the ambiguity and ask the user; do not guess.
3. Present the selected release unit, baseline, reviewed change set, and
   proposed version. Require the user's approval of the change set and exact
   version before changing any file. An approval of only one is incomplete.

## Apply the approved bump

After approval, update the authoritative release version artifacts for the
selected unit and handle the changelog under the changelog and approval rules
below. Stop before editing if release-version authority is unknown,
conflicting, or ambiguous, or if the selected release unit is not uniquely
identified. Do not stage, commit, push, or create a release tag.

### Discover and update version artifacts

Use the repository's manifests, release configuration, documentation, and CI
to identify the version field that controls the selected release unit. Only
update fields whose release purpose is established; do not infer authority
from a file merely containing a version string. Before editing, list every
applicable authoritative file and field, confirm they describe one release
unit, and confirm the proposed version can be applied to all of them. If
authority is unknown, candidate sources conflict, or more than one unit is
not disambiguated by repository configuration, report the paths and values
and stop without changing any release artifact.

- **JavaScript or TypeScript:** use the root `package.json` `version`. Update
  every present applicable root lockfile release-version field. In
  `package-lock.json`, update the top-level `version` and
  `packages[""].version` when present. Do not edit dependency versions. A
  missing lockfile does not block a bump.
- **Rust:** use the selected package's `Cargo.toml` `version`, including a
  version inherited from `[workspace.package]`. If `herdr-plugin.toml` is
  applicable to that package and declares a release `version`, update it to
  the same value. When `Cargo.lock` contains the workspace package, update
  only those workspace package entries using Cargo's workspace-only update
  operation. To avoid partial edits, run that operation against a temporary
  copy of the workspace first and inspect the resulting lockfile diff. Apply
  it to the working tree only if every changed lock entry belongs to a
  workspace package; if any unrelated dependency entry changes, report those
  entries and stop without changing any release artifact.
- **Go:** update a release version field only when project documentation or
  CI identifies that field as authoritative and safely editable. Never use
  the `go.mod` `go` directive as a release version. If no authoritative,
  editable source is established, or multiple candidates cannot be resolved,
  report the evidence and stop without writing files.

Treat all applicable fields for the selected unit as one update. Resolve
source authority and inspect any generated or lockfile changes before writing
the approved version. If an update would require unrelated dependency changes,
or any field cannot be safely updated, stop before modifying any version
artifact; do not leave a partial bump.

### Prepare and approve changelog content

If a tracked root `CHANGELOG.md` exists, prepare a concise, factual entry under
only the applicable Keep a Changelog headings `Added`, `Changed`, and `Fixed`.
Omit empty headings, dates, and boilerplate. Present the complete entry with
the selected release unit, baseline, reviewed change set, and proposed
version. Obtain approval of the change set, exact version, and exact entry
text before writing any file. Approval of only some of these is incomplete.

If `CHANGELOG.md` is absent, ask whether the user wants to create it. If they
decline, continue with an approved manifest-only bump when the verified
baseline rules above are satisfied; omit changelog text. If they agree, show
the complete proposed entry and obtain approval of the change set, exact
version, exact entry text, and file creation before writing. If an untracked
file already occupies `CHANGELOG.md`, do not read or overwrite it; report the
conflict and stop.

Write nothing unless every approval required for the selected path is
explicit. If the user declines the bump or any required approval is missing,
leave all files unchanged. When changelog text is required, declining its
exact text means leave both the changelog and version artifacts unchanged.
After an approved bump, report the changed files and version. Never stage,
commit, push, or create a release tag.
