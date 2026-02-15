# API Route Validation

## Validation Helper

Create a reusable validation helper in `lib/validation.ts`:

```typescript
import { z, type ZodSchema, type ZodError } from "zod";
import { NextResponse } from "next/server";

/**
 * Result of validating a request body
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      error: "Invalid JSON body",
    };
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      success: false,
      error: formatZodError(result.error),
      fieldErrors: extractFieldErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQueryParams<T>(
  request: Request,
  schema: ZodSchema<T>
): ValidationResult<T> {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const result = schema.safeParse(params);

  if (!result.success) {
    return {
      success: false,
      error: formatZodError(result.error),
      fieldErrors: extractFieldErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Validate route parameters against a Zod schema
 */
export function validateParams<T>(
  params: Record<string, string>,
  schema: ZodSchema<T>
): ValidationResult<T> {
  const result = schema.safeParse(params);

  if (!result.success) {
    return {
      success: false,
      error: formatZodError(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Format Zod errors into a user-friendly message
 */
function formatZodError(error: ZodError): string {
  const messages = error.errors.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });

  // Return first error for simplicity, or join for verbose mode
  return messages[0] || "Validation failed";
}

/**
 * Extract field-specific errors for form integration
 */
function extractFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const err of error.errors) {
    const path = err.path.join(".");
    if (path && !fieldErrors[path]) {
      fieldErrors[path] = err.message;
    }
  }

  return fieldErrors;
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
  error: string,
  fieldErrors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      error,
      ...(fieldErrors && Object.keys(fieldErrors).length > 0 && { fieldErrors }),
    },
    { status: 400 }
  );
}
```

## Using in API Routes

### POST - Create Resource

```typescript
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { validateRequest, validationErrorResponse } from "@/lib/validation";
import { createTeamSchema } from "@/lib/schemas";
import { createTeam } from "@/lib/services/team-service";

export async function POST(request: Request) {
  // 1. Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // 2. Validate request body
  const validation = await validateRequest(request, createTeamSchema);
  if (!validation.success) {
    return validationErrorResponse(validation.error, validation.fieldErrors);
  }

  // 3. Call service (data is typed and validated)
  const result = await createTeam(session.user.id, validation.data);

  // 4. Handle service errors
  if (result.error) {
    const status = result.error === "Permission denied" ? 403 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  // 5. Return success
  return NextResponse.json(result.data, { status: 201 });
}
```

### GET with Query Parameters

```typescript
import { z } from "zod";
import { validateQueryParams, validationErrorResponse } from "@/lib/validation";

const listTeamsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Validate query parameters
  const validation = validateQueryParams(request, listTeamsQuerySchema);
  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }

  const { page, limit, search } = validation.data;

  const result = await listTeams(session.user.id, { page, limit, search });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page,
    limit,
  });
}
```

### Route Parameters

```typescript
import { z } from "zod";
import { validateParams, validationErrorResponse } from "@/lib/validation";
import { uuidSchema } from "@/lib/schemas/base";

const teamIdParamsSchema = z.object({
  id: uuidSchema,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Validate route parameters
  const resolvedParams = await params;
  const validation = validateParams(resolvedParams, teamIdParamsSchema);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
  }

  const { id } = validation.data;

  const result = await getTeam(session.user.id, id);

  if (result.error) {
    const status = result.error.includes("not found") ? 404
                 : result.error === "Permission denied" ? 403 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data);
}
```

### PUT/PATCH - Update Resource

```typescript
import { updateTeamSchema } from "@/lib/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Validate route params
  const resolvedParams = await params;
  const paramsValidation = validateParams(resolvedParams, teamIdParamsSchema);
  if (!paramsValidation.success) {
    return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
  }

  // Validate request body
  const bodyValidation = await validateRequest(request, updateTeamSchema);
  if (!bodyValidation.success) {
    return validationErrorResponse(bodyValidation.error, bodyValidation.fieldErrors);
  }

  const result = await updateTeam(
    session.user.id,
    paramsValidation.data.id,
    bodyValidation.data
  );

  if (result.error) {
    const status = result.error.includes("not found") ? 404
                 : result.error === "Permission denied" ? 403 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data);
}
```

## Combining with Service Layer

### Type-Safe Service Functions

The service layer receives validated data:

```typescript
// lib/services/team-service.ts
import type { CreateTeamData, UpdateTeamInput } from "@/lib/schemas";

export async function createTeam(
  userId: string,
  input: CreateTeamData  // Already validated and transformed
): Promise<{ data?: TeamResponse; error?: string }> {
  // No need to validate again - schema already handled it
  // input.name is guaranteed to be trimmed, non-empty string

  const team = await prisma.team.create({
    data: {
      name: input.name,
      description: input.description,
    },
  });

  // ...
}
```

## Error Response Format

Consistent error responses for frontend integration:

```typescript
// Single error
{
  "error": "Team name is required"
}

// With field errors (for form integration)
{
  "error": "Validation failed",
  "fieldErrors": {
    "name": "Team name is required",
    "description": "Description must be less than 500 characters"
  }
}
```

## Handling Prisma Errors with Validation Context

Combine Zod validation with Prisma error handling:

```typescript
import { Prisma } from "@/generated/prisma";

export async function createTeam(
  userId: string,
  input: CreateTeamData
): Promise<{ data?: TeamResponse; error?: string; fieldErrors?: Record<string, string> }> {
  try {
    const team = await prisma.team.create({
      data: { name: input.name, description: input.description },
    });
    return { data: transformTeam(team) };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint - return as field error
        return {
          error: "A team with this name already exists",
          fieldErrors: { name: "A team with this name already exists" },
        };
      }
    }
    console.error("Failed to create team:", error);
    return { error: "Failed to create team" };
  }
}
```

## Testing Validation

Test validation logic separately:

```typescript
import { describe, it, expect } from "vitest";
import { createTeamSchema } from "@/lib/schemas";

describe("createTeamSchema", () => {
  it("should accept valid input", () => {
    const result = createTeamSchema.safeParse({
      name: "My Team",
      description: "A great team",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = createTeamSchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("required");
  });

  it("should trim whitespace", () => {
    const result = createTeamSchema.safeParse({
      name: "  My Team  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("My Team");
    }
  });

  it("should make description optional", () => {
    const result = createTeamSchema.safeParse({
      name: "My Team",
    });
    expect(result.success).toBe(true);
  });
});
```
