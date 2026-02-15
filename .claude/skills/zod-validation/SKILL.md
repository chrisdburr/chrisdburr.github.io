---
name: zod-validation
description: Create consistent validation schemas with Zod. Use when adding form validation, API input validation, or creating reusable schemas. Ensures type-safe validation with consistent error messages across frontend and backend.
---

# Zod Validation Skill

This skill helps create consistent, type-safe validation schemas for forms and API routes.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Schemas                           │
│                  lib/schemas/*.ts                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Base schemas: email, username, password, uuid      │   │
│  │  Domain schemas: team, resource, item, permission    │   │
│  │  Composable and reusable across frontend & API      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                    │                       │
          ┌────────┴────────┐     ┌────────┴────────┐
          ▼                 ▼     ▼                 ▼
┌──────────────────┐  ┌──────────────────────────────────┐
│   Form Validation │  │       API Route Validation        │
│   (Frontend)      │  │       (Backend)                   │
│                   │  │                                   │
│  zodResolver()    │  │  validateRequest() helper         │
│  react-hook-form  │  │  Type-safe request parsing        │
└──────────────────┘  └──────────────────────────────────┘
```

## File Structure

```
lib/
├── schemas/
│   ├── index.ts           # Re-exports all schemas
│   ├── base.ts            # Primitive schemas (email, uuid, etc.)
│   ├── auth.ts            # Authentication schemas
│   ├── team.ts            # Team-related schemas
│   ├── resource.ts        # Resource schemas
│   └── item.ts            # Item schemas
└── validation.ts          # API validation helpers
```

## Quick Reference

### Using Schemas in Forms

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTeamSchema, type CreateTeamInput } from "@/lib/schemas";

const form = useForm<CreateTeamInput>({
  resolver: zodResolver(createTeamSchema),
  defaultValues: { name: "" },
});
```

### Using Schemas in API Routes

```typescript
import { validateRequest } from "@/lib/validation";
import { createTeamSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const validation = await validateRequest(request, createTeamSchema);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { name } = validation.data;
  // ... create team
}
```

### Inferring Types from Schemas

```typescript
import { z } from "zod";
import { createTeamSchema } from "@/lib/schemas";

// Infer input type (what the form/API receives)
type CreateTeamInput = z.input<typeof createTeamSchema>;

// Infer output type (after transforms)
type CreateTeamData = z.output<typeof createTeamSchema>;
```

## Key Principles

1. **Single source of truth** - Define schemas once, use everywhere
2. **Composable schemas** - Build complex schemas from simple ones
3. **Consistent error messages** - Use British English, be user-friendly
4. **Type inference** - Let Zod generate TypeScript types
5. **Frontend + API** - Same validation logic on both sides

## Progressive Disclosure

For detailed patterns:
- **Base schemas and composition**: See `schemas.md`
- **React Hook Form integration**: See `forms.md`
- **API route validation**: See `api-validation.md`
