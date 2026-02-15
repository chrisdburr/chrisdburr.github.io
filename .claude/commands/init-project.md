---
description: Scaffold per-project configuration (CLAUDE.md, rules) by auto-detecting your tech stack
argument-hint: (no arguments needed)
allowed_tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# /init-project

Scaffold per-project configuration files for the apps bootstrap toolkit by auto-detecting the project's tech stack.

## Steps

### 1. Pre-flight: Check for existing CLAUDE.md

If a `CLAUDE.md` already exists at the repo root (NOT inside `.claude/`):

Use `AskUserQuestion` to ask:
- **Question**: "A CLAUDE.md already exists at the repo root. What should I do?"
- **Options**: "Overwrite" / "Skip CLAUDE.md" / "Cancel"

If "Cancel", stop entirely. If "Skip", continue with other files but don't touch CLAUDE.md.

### 2. Detect project mode

Check if `package.json` exists at the repo root.

- **If yes** → **smart mode** (continue to step 3)
- **If no** → **blank mode** (skip to step 8)

### 3. Smart mode: Extract signals

Read `package.json` and scan the project to detect the following. For each detection, record the **value** and the **source** (e.g. "from bun.lock", "from package.json scripts.test").

#### 3a. Project identity

| Field | Detection |
|-------|-----------|
| **Project name** | `package.json` → `name` field. Fallback: directory name. |
| **Description** | `package.json` → `description` field. Fallback: `[TODO]`. |

#### 3b. Package manager

| Signal | Result |
|--------|--------|
| `bun.lock` or `bun.lockb` exists | `bun` |
| `pnpm-lock.yaml` exists | `pnpm` |
| `package-lock.json` exists | `npm` |
| `yarn.lock` exists | `yarn` |
| None | `npm` (default) |

Record the `pkg_exec` prefix for commands:
- bun → `bun run` / `bunx`
- pnpm → `pnpm exec` / `pnpm dlx`
- npm → `npx`
- yarn → `yarn run` / `yarn dlx`

#### 3c. Framework

| Signal | Result |
|--------|--------|
| `next.config.*` exists | Next.js |
| `astro.config.*` exists | Astro |
| `tsconfig.json` exists (no framework) | Vanilla TypeScript |
| None | Unknown |

#### 3d. Linter

| Signal | Result | Check command | Fix command |
|--------|--------|---------------|-------------|
| `biome.json` or `biome.jsonc` exists | Biome | `{pkg_exec} biome check` | `{pkg_exec} biome check --fix` |
| `ultracite` in package.json dependencies or devDependencies | Ultracite (Biome wrapper) | `{pkg_exec} ultracite check` | `{pkg_exec} ultracite fix` |
| `eslint.config.*` or `.eslintrc.*` exists | ESLint | `{pkg_exec} eslint .` | `{pkg_exec} eslint . --fix` |
| None | `[TODO]` | `[TODO]` | `[TODO]` |

**Note**: If ultracite is detected, also check for a `biome.jsonc` — ultracite uses biome under the hood.

#### 3e. TypeScript

| Signal | Result |
|--------|--------|
| `tsconfig.json` exists | TypeScript detected; type check command = `{pkg_exec} tsc --noEmit` |
| None | Not detected |

#### 3f. Test runner

| Signal | Result | Test command |
|--------|--------|-------------|
| `vitest.config.*` exists | Vitest | `{pkg_exec} vitest run` |
| `jest.config.*` exists | Jest | `{pkg_exec} jest` |
| `package.json` has `scripts.test` | Custom | `{pkg_manager} run test` |
| None | `[TODO]` | `[TODO]` |

#### 3g. Database

| Signal | Result |
|--------|--------|
| `prisma/schema.prisma` exists | Prisma |
| `drizzle.config.*` exists | Drizzle |
| None | Not detected |

#### 3h. CSS framework

| Signal | Result |
|--------|--------|
| `tailwind.config.*` exists OR `tailwindcss` in package.json dependencies | Tailwind CSS |
| None | Not detected |

#### 3i. UI library

| Signal | Result |
|--------|--------|
| `components.json` exists at root | shadcn/ui detected |

If `components.json` is detected, read it to extract:
- `aliases.components` → components path (for shadcn.md)
- `aliases.ui` → UI components path (for shadcn.md)

Also check if a `components/ui/` or `src/components/ui/` directory exists.

#### 3j. Docker

| Signal | Result |
|--------|--------|
| `docker-compose.yml` or `docker-compose.local.yml` exists | Docker detected |
| None | Not detected |

#### 3k. Dev commands from package.json scripts

Read `package.json` → `scripts` and extract:

| Script key | Maps to |
|------------|---------|
| `dev` | Dev start command (`{pkg_manager} run dev`) |
| `build` | Build command (`{pkg_manager} run build`) |
| `test` | Test command (if not already detected from config) |
| `lint` | Lint command (if not already detected from config) |
| `start` | Start command |

#### 3l. Project structure

Scan for common directories and record which exist:

- `app/` or `src/app/` (Next.js App Router)
- `pages/` or `src/pages/` (Pages Router or Astro)
- `src/`
- `components/` or `src/components/`
- `lib/` or `src/lib/`
- `prisma/`
- `public/`
- `types/` or `src/types/`
- `tests/` or `__tests__/` or `src/__tests__/`
- `api/` or `src/api/`

Format the found directories into a tree structure for the CLAUDE.md template.

### 4. Smart mode: Present findings

Present all detected values to the user in a formatted summary. Group by category:

```
Detected project settings:

Project:
  - Name: "my-app" (from package.json)
  - Description: "A web application" (from package.json)

Stack:
  - Package manager: bun (from bun.lock)
  - Framework: Next.js (from next.config.ts)
  - TypeScript: yes (from tsconfig.json)
  - CSS: Tailwind CSS (from tailwind.config.ts)
  - UI library: shadcn/ui (from components.json)
  - Database: Prisma (from prisma/schema.prisma)

Tooling:
  - Linter: Ultracite/Biome (from package.json devDependencies)
  - Test runner: Vitest (from vitest.config.ts)
  - Docker: yes (from docker-compose.yml)

Commands:
  - Dev: bun run dev
  - Build: bun run build
  - Lint check: bunx ultracite check
  - Lint fix: bunx ultracite fix
  - Type check: bunx tsc --noEmit
  - Test: bunx vitest run

Structure:
  src/app/  src/components/  src/lib/  prisma/  public/  src/types/

[TODO] items (you'll need to fill these in):
  - Language: [TODO] (British English or American English)
  - Typing rules: [TODO]
  - Git workflow: [TODO]
```

Use `AskUserQuestion` to confirm: "Do these detected settings look correct?"
- Options: "Yes, continue" / "I'll adjust the files manually after"

### 5. Framework-specific rules

If the detected framework is **NOT** Next.js, use `AskUserQuestion` to ask about Next.js-specific files:

**Question**: "This project isn't using Next.js. What should I do with Next.js-specific rules and skills?"
**Options** (multiSelect: true):
- "Remove `rules/nextjs.md`"
- "Remove `skills/server-actions/`"
- "Remove `skills/prisma-api/`" (only show if no Prisma detected)
- "Keep everything (for reference)"

If the user selects removals, note them for the report but **do not delete files** — just inform the user which files they can safely remove. The bootstrap should stay intact as a template.

### 6. Language preference

If language was not auto-detected, use `AskUserQuestion`:

**Question**: "Which English variant should be used in code and documentation?"
**Options**: "British English (Recommended)" / "American English"

### 7. Smart mode: Generate files

#### 7a. Root CLAUDE.md

1. Read the template from `.claude/templates/project-claude.md`.
2. Replace `[TODO: ...]` placeholders with detected values:

| Placeholder | Replace with |
|-------------|-------------|
| `[TODO: Project name]` | Detected project name |
| `[TODO: One-line description...]` | Detected description or keep `[TODO]` |
| `[TODO: e.g. TypeScript, Tailwind CSS, Biome, NextAuth.js]` | Actual detected stack (e.g. "TypeScript, Tailwind CSS, Biome") |
| `[TODO: What this project does...]` | Detected description or keep `[TODO]` |
| `[TODO: e.g. "No `any`..."]` | `[TODO: define typing rules]` (always manual) |
| `[TODO: e.g. "British English"...]` | User's language choice |
| `[TODO: e.g. "`bunx ultracite check`..."]` | Detected lint check command |
| `[TODO: ProjectName]/` and directory tree | Detected project structure |
| `[TODO: e.g. `feature/bugfix`...]` | `[TODO: define branch flow]` (always manual) |
| `[TODO: Any project-specific...]` | Keep as `[TODO]` |

3. Write to `CLAUDE.md` at the repo root.

#### 7b. rules/commands.md

Replace `[TODO: ...]` placeholders in `.claude/rules/commands.md` with detected commands:

| Placeholder pattern | Replace with |
|--------------------|-------------|
| `[TODO: start command...]` | Docker command if detected, or `{pkg_manager} run dev`, or keep `[TODO]` |
| `[TODO: stop command...]` | Docker stop if detected, or keep `[TODO]` |
| `[TODO: restart command...]` | Docker restart if detected, or keep `[TODO]` |
| `[TODO: logs command...]` | Docker logs if detected, or keep `[TODO]` |
| `[TODO: lint check command...]` | Detected lint check command |
| `[TODO: lint fix command...]` | Detected lint fix command |
| `[TODO: type check command...]` | Detected type check command |
| `[TODO: test command...]` | Detected test command |
| `[TODO: test watch command...]` | Test watch variant or keep `[TODO]` |
| `[TODO: coverage command...]` | Coverage variant or keep `[TODO]` |

Use the `Edit` tool to replace each placeholder. Leave any `[TODO]` that couldn't be filled.

#### 7c. rules/linting.md

Replace `[TODO: ...]` placeholders in `.claude/rules/linting.md`:

| Placeholder | Replace with |
|-------------|-------------|
| `[TODO: linter name...]` | Detected linter name (e.g. "Biome", "Ultracite", "ESLint") |
| `[TODO: linter description...]` | e.g. "Ultracite (Biome wrapper) with `biome.jsonc`" |
| `[TODO: lint check command...]` | Detected check command |
| `[TODO: lint fix command...]` | Detected fix command |

#### 7d. rules/shadcn.md (if shadcn detected)

Replace `[TODO: ...]` placeholders in `.claude/rules/shadcn.md`:

| Placeholder | Replace with |
|-------------|-------------|
| `[TODO: components/ui path...]` | Detected UI components path (e.g. `src/components/ui`) |
| `[TODO: shadcn add command...]` | e.g. `bunx --bun shadcn@latest add {component_name}` |

#### 7e. .gitattributes (if beads detected or user wants it)

If a `.beads/` directory exists or the user wants beads integration, create or update `.gitattributes`:

```
.beads/** merge=beads-hierarchical
```

### 8. Blank mode

If no `package.json` was found:

1. Copy `.claude/templates/project-claude.md` to repo root as `CLAUDE.md` **without any substitutions** — all `[TODO]` placeholders remain.
2. Leave `rules/commands.md`, `rules/linting.md`, and `rules/shadcn.md` as-is with their `[TODO]` placeholders.
3. Keep all rules and skills (user removes manually what they don't need).

Tell the user: "No `package.json` found — created CLAUDE.md with placeholder values. Fill in the `[TODO]` items and run `/init-project` again after your project is set up."

### 9. Optional: Beads initialisation

If the `bd` CLI is available (check with `command -v bd`), use `AskUserQuestion`:

**Question**: "Would you like to initialise beads issue tracking for this project?"
**Options**: "Yes" / "No"

If yes, ask for the issue prefix:
**Question**: "What prefix should beads use for issue IDs?"
**Options**: The detected project name (uppercased, first 3-4 chars) as first option, plus "Custom" as second option.

Then run: `bd init --prefix {PREFIX}`

Update `rules/beads.md` to replace the `{ProjectPrefix}` placeholder with the chosen prefix.

### 10. Report results

List each file with its status:

```
=== /init-project complete ===

Created:
  - CLAUDE.md (root) — project configuration

Updated:
  - .claude/rules/commands.md — filled dev/lint/test commands
  - .claude/rules/linting.md — filled linter details
  - .claude/rules/shadcn.md — filled component paths

Skipped:
  - .gitattributes — already exists

Remaining [TODO] items:
  - CLAUDE.md: typing rules, git workflow
  - commands.md: test watch, coverage, test users

Files you may want to remove (non-Next.js project):
  - .claude/rules/nextjs.md
  - .claude/skills/server-actions/
```

Suggest next steps:
1. Review and fill in remaining `[TODO]` placeholders
2. Run `bash .claude/scripts/check-quality.sh` to verify tooling works
3. Start work with `/next-issue` or `bd create`
