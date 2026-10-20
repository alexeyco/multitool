# Design: Current Repository Documentation

## Approach

Write two English Markdown documents based on verified repository contents. The README will identify the project, describe its current minimal state, and point to the existing MIT license. The contribution guide will set factual expectations for proposing changes and will not prescribe commands unsupported by repository configuration.

## Files to touch

- `README.md` — replace the heading-only text with a current-state project overview.
- `CONTRIBUTING.md` — add contribution guidance grounded in the repository's present state.

## Decisions and trade-offs

- Keep the text limited to facts confirmed in the repository.
- Do not describe future plugin behavior, ported commands, or command syntax.
- Avoid validation instructions because the repository has no source files, tests, CI, or package metadata that define such commands.
