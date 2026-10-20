import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import plugin from "../opencode/index.ts";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const entries = [
  ["docs.changelog", "docs-changelog"],
  ["repo.branch", "repo-branch"],
  ["repo.commit", "repo-commit"],
  ["repo.pr", "repo-pr"],
  ["repo.push", "repo-push"],
  ["repo.sync", "repo-sync"],
  ["repo.tag", "repo-tag"],
  ["repo.trunk", "repo-trunk"],
] as const;

function parseFrontmatter(source: string) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  assert.ok(match, "source must have YAML frontmatter");
  return { metadata: match[1], content: match[2] };
}

function getField(metadata: string, name: string) {
  const match = metadata.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  assert.ok(match, `frontmatter must include ${name}`);
  return match[1].trim();
}

async function initializePlugin() {
  const skills: any[] = [];
  const commands: any[] = [];
  const skillTransformCalls: string[] = [];
  const commandTransformCalls: string[] = [];
  const prompts: any[] = [];
  const ctx = {
    skill: {
      transform: async (callback: (editor: { add: (value: any) => void }) => void) => {
        skillTransformCalls.push("transform");
        callback({ add: (skill) => skills.push(skill) });
      },
      reload: async () => skillTransformCalls.push("reload"),
    },
    command: {
      transform: async (callback: (editor: { add: (value: any) => void }) => void) => {
        commandTransformCalls.push("transform");
        callback({ add: (command) => commands.push(command) });
      },
      reload: async () => commandTransformCalls.push("reload"),
    },
    session: { prompt: async (prompt: unknown) => prompts.push(prompt) },
  };

  await plugin.setup(ctx as never);
  return { skills, commands, skillTransformCalls, commandTransformCalls, prompts };
}

test("registers every bundled skill and command with source mappings", async () => {
  const { skills, commands, skillTransformCalls, commandTransformCalls } =
    await initializePlugin();

  assert.deepEqual(skills.map((skill) => skill.id), entries.map(([, id]) => id));
  assert.deepEqual(commands.map((command) => command.name), entries.map(([name]) => name));
  assert.deepEqual(skillTransformCalls, ["transform", "reload"]);
  assert.deepEqual(commandTransformCalls, ["transform", "reload"]);

  for (const [commandName, skillID] of entries) {
    const skill = skills.find((entry) => entry.id === skillID);
    const command = commands.find((entry) => entry.name === commandName);
    const skillPath = resolve(root, "codex", "skills", skillID, "SKILL.md");
    const commandPath = resolve(root, "opencode", "commands", `${commandName}.md`);
    const skillSource = await readFile(skillPath, "utf8");
    const commandSource = await readFile(commandPath, "utf8");
    const parsedSkill = parseFrontmatter(skillSource);
    const parsedCommand = parseFrontmatter(commandSource);

    assert.ok(isAbsolute(skill.path), `${skillID} source path must be absolute`);
    assert.equal(skill.path, skillPath);
    assert.equal(skill.name, getField(parsedSkill.metadata, "name"));
    assert.equal(skill.description, getField(parsedSkill.metadata, "description"));
    assert.equal(skill.content, parsedSkill.content);
    assert.equal(command.description, getField(parsedCommand.metadata, "description"));
  }
});

test("forwards arguments and attachment parts unchanged to the matching skill", async () => {
  const { commands, prompts } = await initializePlugin();
  const prompt = {
    arguments: "release --dry-run",
    parts: [
      { type: "text", text: "Please inspect these files" },
      { type: "file", url: "file:///tmp/notes.txt", filename: "notes.txt" },
      { type: "image", url: "data:image/png;base64,AA==" },
    ],
  };

  for (const [commandName, skillID] of entries) {
    const sessionID = `session-${commandName}`;
    await commands.find((command) => command.name === commandName).execute({
      sessionID,
      prompt,
    });
    assert.deepEqual(prompts.at(-1), {
      ...prompt,
      sessionID,
      skills: [{ id: skillID }],
    });
  }
});
