---
paths:
  - "**/*.{ts,tsx,js,jsx}"
---

# Linting & Formatting — Ultracite (Biome preset)

This project uses Ultracite with `biome.jsonc` for linting and formatting.

## Commands

```bash
# Check for lint/format issues (read-only)
bunx ultracite check

# Auto-fix lint and formatting issues
bunx ultracite fix
```

- Always use bun to run the linter
- Run the fix command after making code changes, before committing
- Do not use Prettier or add any other formatter
