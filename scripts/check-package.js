import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = mkdtempSync(resolve(tmpdir(), "multitool-npm-cache-"));
let pack;
try {
  pack = spawnSync("npm", ["pack", "--dry-run", "--json", "--cache", cache], {
    cwd: root,
    encoding: "utf8",
  });
} finally {
  rmSync(cache, { recursive: true, force: true });
}

if (pack.error) {
  console.error(`Unable to run npm pack: ${pack.error.message}`);
  process.exit(1);
}
if (pack.status !== 0) {
  process.stderr.write(pack.stderr);
  process.exit(pack.status ?? 1);
}

let inventory;
try {
  inventory = JSON.parse(pack.stdout);
} catch (error) {
  console.error(`Unable to parse npm pack inventory: ${error.message}`);
  process.exit(1);
}

const files = new Set(inventory[0]?.files?.map(({ path }) => path) ?? []);
const packageMetadata = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const codexPlugin = JSON.parse(readFileSync(resolve(root, ".codex-plugin/plugin.json"), "utf8"));
const marketplace = JSON.parse(readFileSync(resolve(root, ".agents/plugins/marketplace.json"), "utf8"));
const marketplacePlugin = marketplace.plugins.find(({ name }) => name === codexPlugin.name);
const required = [
  ".codex-plugin/plugin.json",
  "opencode/index.ts",
  ...[
    "multitool.bump",
    "multitool.branch",
    "multitool.commit",
    "multitool.pr",
    "multitool.tag",
  ].map((name) => `opencode/commands/${name}.md`),
  ...[
    "bump",
    "branch",
    "commit",
    "pr",
    "tag",
  ].map((id) => `codex/skills/${id}/SKILL.md`),
];

const removed = [
  "opencode/commands/docs.changelog.md",
  "codex/skills/docs-changelog/SKILL.md",
  ...["branch", "commit", "pr", "tag"].map(
    (name) => `opencode/commands/${name}.md`,
  ),
  "opencode/commands/bump.md",
  ...[
    "repo.branch",
    "repo.commit",
    "repo.pr",
    "repo.push",
    "repo.sync",
    "repo.tag",
    "repo.trunk",
  ].map((name) => `opencode/commands/${name}.md`),
  ...[
    "repo-branch",
    "repo-commit",
    "repo-pr",
    "repo-push",
    "repo-sync",
    "repo-tag",
    "repo-trunk",
  ].map((id) => `codex/skills/${id}/SKILL.md`),
];

if (codexPlugin.skills !== "./codex/skills/") {
  console.error("Codex plugin manifest must register ./codex/skills/.");
  process.exit(1);
}
if (marketplacePlugin?.source?.package !== packageMetadata.name) {
  console.error("Codex marketplace must install the package declared in package.json.");
  process.exit(1);
}

const missing = required.filter((file) => !files.has(file));
if (missing.length > 0) {
  console.error(`npm package is missing required files:\n${missing.map((file) => `- ${file}`).join("\n")}`);
  process.exit(1);
}

const unexpected = removed.filter((file) => files.has(file));
if (unexpected.length > 0) {
  console.error(`npm package contains retired files:\n${unexpected.map((file) => `- ${file}`).join("\n")}`);
  process.exit(1);
}

console.log(`Package inventory includes all ${required.length} required plugin, command, and skill files.`);
