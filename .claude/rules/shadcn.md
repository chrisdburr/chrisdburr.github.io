# shadcn/ui Component Rules

Always prefer shadcn/ui components over custom implementations, HTML elements, or third-party UI libraries.

## Before building any UI

1. Check if a shadcn component exists for the pattern you need (dialog, select, dropdown, tabs, toast, etc.)
2. Check if it's already installed in `[TODO: components/ui path, e.g. src/components/ui]`
3. If not installed, add it before using it:
   ```bash
   [TODO: shadcn add command, e.g. bunx --bun shadcn@latest add {component_name}]
   ```

## Rules

- **Never** install shadcn component packages directly with your package manager — always use the `shadcn add` CLI
- **Never** build custom versions of components that shadcn already provides (dialogs, dropdowns, selects, tooltips, popovers, tabs, toasts, etc.)
- **Never** use raw HTML elements (`<select>`, `<dialog>`, `<input>`) when a shadcn equivalent exists
- Import from `@/components/ui/{component}` — these are the project's canonical UI primitives
- Compose shadcn primitives for complex UI rather than reaching for external libraries

## Currently installed components

Check `[TODO: components/ui path, e.g. src/components/ui]` for what's already available.

## Reference

Full component list: https://ui.shadcn.com/docs/components
