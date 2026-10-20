# Contributing

Contributions should reflect the files and behavior that currently exist. Keep documentation claims grounded in the repository's current contents.

## Proposing a change

- Explain the purpose and scope of the proposed change.
- Keep documentation claims grounded in the repository's current contents.
- Do not describe planned commands or plugin behavior as available features.

## Branch naming

Use `feat/<kebab-desc>`, `fix/<kebab-desc>`, or `chore/<kebab-desc>` for branch names.

## Validation

Use Node.js `>=22.18`. From the repository root, install the locked
dependencies and run the defined checks:

```sh
npm ci
make check
npm pack --dry-run
```

`make check` runs the plugin tests and validates the package inventory.

## Preparing an npm release

Maintainers must configure the GitHub Actions repository secret `NPM_TOKEN`
with an npm token that can publish `@alexeyco/multitool`. The publish workflow
also needs the `id-token: write` permission to generate npm provenance; this
permission is declared by `.github/workflows/publish.yml`.

To release a version, push a tag whose name is exactly `v` followed by the
version in `package.json` (for example, version `0.1.0` uses tag `v0.1.0`).
The tagged commit must be reachable from `master`. The workflow runs
`npm ci`, `make check`, and `npm pack --dry-run` before publishing. It publishes
only for pushed `v*` tags that pass the version and ancestry checks.

## License

The project is licensed under the MIT License. See [LICENSE](LICENSE).
