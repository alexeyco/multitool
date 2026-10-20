import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Plugin, Skill } from "@opencode/plugin";

const SKILL_IDS = [
  "docs-changelog",
  "repo-branch",
  "repo-commit",
  "repo-pr",
  "repo-push",
  "repo-sync",
  "repo-tag",
  "repo-trunk",
] as const;

const COMMANDS = [
  { name: "docs.changelog", skillID: "docs-changelog" },
  { name: "repo.branch", skillID: "repo-branch" },
  { name: "repo.commit", skillID: "repo-commit" },
  { name: "repo.pr", skillID: "repo-pr" },
  { name: "repo.push", skillID: "repo-push" },
  { name: "repo.sync", skillID: "repo-sync" },
  { name: "repo.tag", skillID: "repo-tag" },
  { name: "repo.trunk", skillID: "repo-trunk" },
] as const;

const sourceRoot = resolve(import.meta.dirname, "..");

function parseFrontmatter(source: string, file: string) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter in ${file}`);
  }

  return { metadata: match[1], content: match[2] };
}

function field(metadata: string, key: string, file: string) {
  const match = metadata.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) {
    throw new Error(`Missing ${key} field in ${file}`);
  }

  return match[1].trim();
}

export default Plugin.define({
  id: "multitool",
  async setup(ctx) {
    const skills = await Promise.all(
      SKILL_IDS.map(async (id) => {
        const file = resolve(sourceRoot, "codex", "skills", id, "SKILL.md");
        const source = await readFile(file, "utf8");
        const parsed = parseFrontmatter(source, file);

        return {
          id,
          file,
          name: field(parsed.metadata, "name", file),
          description: field(parsed.metadata, "description", file),
          content: parsed.content,
        };
      }),
    );

    await ctx.skill.transform((editor) => {
      for (const skill of skills) {
        editor.add(
          Skill.Info.make({
            id: Skill.ID.make(skill.id),
            name: Skill.Name.make(skill.name),
            description: skill.description,
            path: skill.file as Skill.Info["path"],
            content: skill.content,
          }),
        );
      }
    });
    await ctx.skill.reload();

    const commands = await Promise.all(
      COMMANDS.map(async (command) => {
        const file = resolve(
          sourceRoot,
          "opencode",
          "commands",
          `${command.name}.md`,
        );
        const source = await readFile(file, "utf8");
        const { metadata } = parseFrontmatter(source, file);

        return {
          ...command,
          description: field(metadata, "description", file),
        };
      }),
    );

    await ctx.command.transform((editor) => {
      for (const command of commands) {
        editor.add({
          name: command.name,
          description: command.description,
          execute: async ({ sessionID, prompt }) => {
            await ctx.session.prompt({
              ...prompt,
              sessionID,
              skills: [{ id: Skill.ID.make(command.skillID) }],
            });
          },
        });
      }
    });
    await ctx.command.reload();
  },
});
