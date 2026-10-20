---
name: docs-changelog
description: Review tracked repository changes and propose an approved Keep a Changelog entry.
---

# Update the changelog

Prepare one concise, factual, versioned entry for the repository's root
`CHANGELOG.md`. Do not write anything until the user approves the selected
changes, the exact entry text, and the version.

## Collect the eligible changes

1. Inspect repository status and Git metadata. Read only tracked files and
   metadata. Do not read untracked file contents; exclude untracked files from
   the proposal entirely.
2. Find the changelog baseline:
   - If the tracked root `CHANGELOG.md` has a versioned top entry with a
     corresponding Git tag, use that tag's commit.
   - If there is no changelog version or tag baseline, suggest `0.1.0` as the
     initial entry version and ask the user to select a base commit. Do not
     proceed until they provide or approve the base commit.
   - If a versioned changelog header has no corresponding Git tag, ask the
     user to select a base commit before proceeding. Do not silently substitute
     another tag or `HEAD`.
   - Accept a tag spelling that matches the version either with or without a
     leading `v`. If the header cannot be associated unambiguously with a tag,
     treat it as untagged and ask for a base commit.
3. Review all commits after the selected baseline and all staged and unstaged
   changes to tracked files. Inspect the staged diff, unstaged diff, and the
   aggregate tracked working-tree diff relative to `HEAD`. Use the aggregate
   diff as the final working-tree state so staged and unstaged changes to the
   same hunk are represented once. Combine that state with the baseline-to-
   `HEAD` commit diff. Do not count overlapping staged and unstaged hunks
   twice.
4. Exclude untracked files even if they appear relevant. If there are no
   eligible tracked changes or commits since the baseline, report that there
   is nothing to add and stop without creating an empty entry.

## Propose the version and entry

1. Summarize only the eligible changes. Be concise, factual, and specific; do
   not claim behavior that the reviewed changes do not establish.
2. Use Keep a Changelog headings only: `Added`, `Changed`, and `Fixed`. Include
   only applicable headings and omit headings with no entries. Do not add a
   date, boilerplate, or empty section.
3. Propose a SemVer version. For the initial entry, use the suggested `0.1.0`
   unless the user selects another version. For a later entry, base the
   proposal on the latest versioned changelog header and its matching tag;
   suggest a minor increment for added functionality, a patch increment for
   compatible changes or fixes, and a major increment only for a clearly
   documented breaking change. Ask the user when the impact or next version is
   ambiguous.
4. Present the baseline commit, the included change set (including commit and
   working-tree changes), the proposed version, and the complete proposed
   entry. Ask the user to approve or revise the change set, text, and version.
   Approval of only some of these is not approval to write.
5. If the root `CHANGELOG.md` is absent, ask separately whether to create it.
   If the user declines, stop without creating the file. If an untracked file
   already occupies that path, do not read or overwrite it; report the
   conflict and stop.
6. Write the approved entry only after the user has agreed to the change set,
   exact text, and version, and has approved creating the file when it was
   absent. If the user declines or has not agreed to all three, do not write.

Keep the changelog as a record of reviewed, eligible changes. Do not stage,
commit, or push changes as part of this workflow.
