# Contributing

Contributions should reflect the files and behavior that currently exist. Keep documentation claims grounded in the repository's current contents.

## Proposing a change

- Explain the purpose and scope of the proposed change.
- Keep documentation claims grounded in the repository's current contents.
- Do not describe planned skills or behavior as available features.

## Branch naming

Use `feat/<kebab-desc>`, `fix/<kebab-desc>`, or `chore/<kebab-desc>` for branch names.

## Validation

The repository contains only Markdown skills and documentation. Verify that
the skills CLI discovers every skill from the repository root:

```sh
npx skills add . --list
```

Each `skills/<skill-id>/SKILL.md` must keep valid YAML frontmatter with `name`
and `description` fields.

## License

The project is licensed under the MIT License. See [LICENSE](LICENSE).