# Design: GitHub Actions and npm distribution

## Approach

Publish `@alexeyco/multitool` version `0.1.0` as a native OpenCode v2 plugin and a Codex plugin. Set `package.json` to use ESM, export `.` to `./opencode/index.ts`, include the `.codex-plugin/`, `opencode/`, and `codex/skills/` trees in the package, depend on `@opencode/plugin`, and require Node.js `>=22.18`. The Codex manifest registers the existing `codex/skills/` directory, and `.agents/plugins/marketplace.json` points Codex to the npm package. OpenCode loads the plugin with `Plugin.define` and setup hooks. For each skill, derive the absolute `codex/skills/<id>/SKILL.md` path from `import.meta.dirname`, read its content, and register both the `Skill.Info` location and content through `ctx.skill.transform` before `ctx.skill.reload`. Register all eight command definitions through `ctx.command.transform` and `ctx.command.reload`. Each command prompts the session with its corresponding skill ID and forwards invocation arguments and all text or attachment parts supported by the v2 command API unchanged. Keep the current markdown files as the only source for command and skill instructions; do not copy them into agent config directories or duplicate their contents in TypeScript.

Use the upstream CI shape: on pull requests and pushes to `master`, checkout with `actions/checkout@v7`, setup Node.js 22 with npm caching using `actions/setup-node@v7`, run `npm ci`, `make check`, and `npm pack --dry-run`. Define `make check` to validate the package manifest and packed file inventory, and run plugin registry tests for all eight skill and command mappings.

The publish workflow runs for pushed tags matching `v*`. It checks out the tag with `actions/checkout@v7` and `fetch-depth: 0` so the full branch history is available, configures Node.js 22 and the npm registry with `actions/setup-node@v7`, verifies that the tag is exactly `v` plus the package version and that the tagged commit is reachable from `master`, runs `npm ci`, `make check`, and `npm pack --dry-run`, then publishes with `npm publish --provenance --access public`. Grant `contents: read` and `id-token: write`, and pass the repository's `NPM_TOKEN` secret as `NODE_AUTH_TOKEN` to the publish step. Do not publish on pull requests or ordinary branch pushes.

## Files to touch

- `package.json` — declare the ESM package, `@alexeyco/multitool` name and version `0.1.0`, `./opencode/index.ts` export, `@opencode/plugin` dependency, Node.js engine, packaged files, and scripts.
- `package-lock.json` — lock package metadata and dependencies.
- `.codex-plugin/plugin.json` — register the bundled Codex skills directory.
- `.agents/plugins/marketplace.json` — expose the npm package through the repository Codex marketplace.
- `opencode/index.ts` — implement OpenCode v2 plugin setup, absolute skill source locations derived from `import.meta.dirname`, skill and command registry transforms and reloads, and argument/attachment-preserving command-to-skill prompts.
- `Makefile` — define `check` for registry tests and package inventory validation.
- `test/plugin.test.ts` — test all eight skill and command registrations, absolute source locations and content, command-to-skill mappings, and unchanged prompt arguments and attachments.
- `scripts/check-package.js` — validate package metadata, Codex manifest/marketplace consistency, and required skill and command files in the npm package inventory.
- `.github/workflows/ci.yml` — validate pull requests and pushes to `master`.
- `.github/workflows/publish.yml` — fetch full Git history, validate version tags and master ancestry, and publish to npm with provenance.
- `README.md` — document OpenCode and Codex installation and current commands and skills.
- `CONTRIBUTING.md` — document local checks and maintainer release configuration.
- `CHANGELOG.md` — add the implemented plugin and workflow changes to the existing `0.1.0` entry only after reviewing the full change set and obtaining approval for the exact entry.

## Decisions and trade-offs

- Use native agent plugin installation. OpenCode loads the npm package from its `plugin` configuration and registers commands and skills in memory. Codex installs the npm package through the repository marketplace and loads its skills from the plugin manifest.
- Keep Codex skill Markdown and OpenCode command Markdown as source files in the npm package. The plugin reads skill contents from those files, includes each absolute source path in `Skill.Info`, and defines commands that invoke their skill IDs.
- Forward command prompt text and every attachment/input part provided by the OpenCode v2 command API unchanged to the session prompt, preserving the existing `$ARGUMENTS` behavior.
- Use the upstream `make check` CI convention and Node.js 22 toolchain. The check covers plugin registry behavior and package contents; `npm pack --dry-run` checks npm's package boundary.
- Publish only on `v*` tag pushes after version matching, full-history master ancestry verification, and all release checks pass. Use the repository's `NPM_TOKEN` as `NODE_AUTH_TOKEN`, plus the OIDC permission required for provenance.
- Review the changelog baseline and complete eligible branch change set, present exact entry text under `0.1.0`, and obtain approval for the change set, exact text, and version before updating the existing entry.
