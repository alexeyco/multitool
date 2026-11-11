## MODIFIED Requirements

### Requirement: Install Codex skills through a Codex plugin marketplace

The npm package SHALL include a Codex plugin manifest that registers the existing `codex/skills/` directory, and the repository SHALL provide a marketplace entry that installs the published npm package.

#### Scenario: Install skills in Codex

**WHEN** a user adds the repository marketplace and installs `multitool`
**THEN** Codex loads the bundled skills from the npm package without requiring manual file copies.

#### Scenario: Register the existing command set

**WHEN** the plugin initializes
**THEN** it registers exactly `/multitool.branch`, `/multitool.commit`, `/multitool.pr`, `/multitool.tag`, and `/multitool.bump` through the OpenCode command API, with no removed command names or aliases.

#### Scenario: Register bundled skills from their source files

**WHEN** the plugin initializes
**THEN** it registers exactly the `branch`, `commit`, `pr`, `tag`, and `bump` skill contents and absolute `codex/skills/<id>/SKILL.md` locations, derived from `import.meta.dirname`, as OpenCode `Skill.Info` entries through the plugin skill API without maintaining duplicate skill text.

#### Scenario: Invoke the matching skill from a command

**WHEN** a user invokes one of the registered OpenCode commands
**THEN** the command prompts the session with the matching existing skill ID and uses that registered skill's content.

#### Scenario: Forward command arguments and attachments unchanged

**WHEN** a user invokes a registered command with argument text and attachment parts supported by the OpenCode v2 command API
**THEN** the plugin forwards the argument text and every supported attachment/input part unchanged to the session prompt for the matching skill.

#### Scenario: Refresh plugin-provided skills and commands

**WHEN** the plugin registers skills and commands during setup
**THEN** it calls the OpenCode v2 skill and command reload APIs after transforming their registries.

#### Scenario: Preserve the existing workflow content

**WHEN** the npm package is built or packed
**THEN** the bundled Codex skill files and OpenCode command Markdown files, including the `bump` workflow and excluding the removed `push`, `sync`, and `trunk` workflows, are included as the source content used by the plugin.

#### Scenario: Verify the plugin registry and package contents

**WHEN** a contributor runs `make check`
**THEN** executable checks verify exactly five command registrations, five skill registrations, command-to-skill mappings, absence of removed names and aliases, absolute `Skill.Info` locations, loaded source content, unchanged argument and attachment forwarding, and required files in the npm package inventory.

#### Scenario: Run the project check

**WHEN** a contributor runs `make check`
**THEN** the Makefile target runs the plugin registry tests and package inventory validation and fails if either check fails.
