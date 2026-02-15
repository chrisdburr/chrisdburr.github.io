# Schema Patterns

## Base Schemas

Create reusable primitive schemas in `lib/schemas/base.ts`:

```typescript
import { z } from "zod";

// ============================================
// String Primitives
// ============================================

/**
 * Valid email address
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters")
  .transform((v) => v.toLowerCase().trim());

/**
 * Username - alphanumeric, no spaces
 */
export const usernameSchema = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(150, "Username must be less than 150 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
  .transform((v) => v.trim());

/**
 * Strong password
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(
    /(?=.*[A-Z])/,
    "Password must contain at least one uppercase letter"
  )
  .regex(
    /(?=.*[a-z])/,
    "Password must contain at least one lowercase letter"
  )
  .regex(
    /(?=.*\d)/,
    "Password must contain at least one number"
  )
  .regex(
    /(?=.*[\W_])/,
    "Password must contain at least one special character"
  );

/**
 * UUID v4 format
 */
export const uuidSchema = z
  .string()
  .uuid("Invalid ID format");

/**
 * Non-empty trimmed string
 */
export const requiredString = (fieldName: string, minLength = 1, maxLength = 500) =>
  z
    .string()
    .min(minLength, `${fieldName} is required`)
    .max(maxLength, `${fieldName} must be less than ${maxLength} characters`)
    .transform((v) => v.trim());

/**
 * Optional trimmed string (empty string becomes undefined)
 */
export const optionalString = (maxLength = 2000) =>
  z
    .string()
    .max(maxLength, `Must be less than ${maxLength} characters`)
    .transform((v) => v.trim() || undefined)
    .optional();

// ============================================
// Number Primitives
// ============================================

/**
 * Positive integer ID
 */
export const positiveIntSchema = z
  .number()
  .int("Must be a whole number")
  .positive("Must be a positive number");

/**
 * Coerce string to positive integer (for query params)
 */
export const coercePositiveInt = z.coerce
  .number()
  .int("Must be a whole number")
  .positive("Must be a positive number");

// ============================================
// Enums
// ============================================

/**
 * Permission levels
 */
export const permissionLevelSchema = z.enum(
  ["VIEW", "COMMENT", "EDIT", "ADMIN"],
  { errorMap: () => ({ message: "Invalid permission level" }) }
);

/**
 * Team roles
 */
export const teamRoleSchema = z.enum(
  ["ADMIN", "MEMBER"],
  { errorMap: () => ({ message: "Invalid team role" }) }
);

/**
 * Status values
 */
export const statusSchema = z.enum(
  ["DRAFT", "ACTIVE", "ARCHIVED"],
  { errorMap: () => ({ message: "Invalid status" }) }
);
```

## Domain Schemas

Build domain-specific schemas from base schemas.

### Team Schemas (`lib/schemas/team.ts`)

```typescript
import { z } from "zod";
import { requiredString, optionalString, uuidSchema, teamRoleSchema, emailSchema } from "./base";

/**
 * Create a new team
 */
export const createTeamSchema = z.object({
  name: requiredString("Team name", 2, 100),
  description: optionalString(500),
});

export type CreateTeamInput = z.input<typeof createTeamSchema>;
export type CreateTeamData = z.output<typeof createTeamSchema>;

/**
 * Update team details
 */
export const updateTeamSchema = z.object({
  name: requiredString("Team name", 2, 100).optional(),
  description: optionalString(500),
}).refine(
  (data) => data.name !== undefined || data.description !== undefined,
  { message: "At least one field must be provided" }
);

export type UpdateTeamInput = z.input<typeof updateTeamSchema>;

/**
 * Add member to team
 */
export const addTeamMemberSchema = z.object({
  email: emailSchema,
  role: teamRoleSchema.default("MEMBER"),
});

export type AddTeamMemberInput = z.input<typeof addTeamMemberSchema>;

/**
 * Update member role
 */
export const updateMemberRoleSchema = z.object({
  role: teamRoleSchema,
});

/**
 * Team ID parameter
 */
export const teamIdParamSchema = z.object({
  id: uuidSchema,
});
```

### Resource Permission Schemas (`lib/schemas/resource-permission.ts`)

```typescript
import { z } from "zod";
import { uuidSchema, emailSchema, permissionLevelSchema } from "./base";

/**
 * Share resource with user
 */
export const shareResourceWithUserSchema = z.object({
  email: emailSchema,
  level: permissionLevelSchema,
});

export type ShareResourceWithUserInput = z.input<typeof shareResourceWithUserSchema>;

/**
 * Share resource with team
 */
export const shareResourceWithTeamSchema = z.object({
  teamId: uuidSchema,
  level: permissionLevelSchema,
});

export type ShareResourceWithTeamInput = z.input<typeof shareResourceWithTeamSchema>;

/**
 * Update permission level
 */
export const updatePermissionSchema = z.object({
  level: permissionLevelSchema,
});

/**
 * Bulk share with multiple users
 */
export const bulkShareSchema = z.object({
  shares: z.array(shareResourceWithUserSchema).min(1, "At least one share required").max(50, "Maximum 50 shares at once"),
});
```

### Item Schemas (`lib/schemas/item.ts`)

```typescript
import { z } from "zod";
import { requiredString, optionalString, uuidSchema, statusSchema } from "./base";

/**
 * Create item
 */
export const createItemSchema = z.object({
  name: requiredString("Name", 2, 200),
  description: optionalString(5000),
  status: statusSchema.default("DRAFT"),
  // Relationships
  parentId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
});

export type CreateItemInput = z.input<typeof createItemSchema>;

/**
 * Update item
 */
export const updateItemSchema = z.object({
  name: requiredString("Name", 2, 200).optional(),
  description: optionalString(5000),
  status: statusSchema.optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "At least one field must be provided" }
);

export type UpdateItemInput = z.input<typeof updateItemSchema>;
```

## Schema Composition Patterns

### Extending Schemas

```typescript
// Base schema
const personSchema = z.object({
  name: requiredString("Name"),
  email: emailSchema,
});

// Extended schema with additional fields
const employeeSchema = personSchema.extend({
  employeeId: z.string(),
  department: z.string(),
});

// Pick specific fields
const contactSchema = personSchema.pick({ email: true });

// Omit specific fields
const publicPersonSchema = personSchema.omit({ email: true });
```

### Merging Schemas

```typescript
const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const teamWithTimestamps = createTeamSchema.merge(timestampsSchema);
```

### Conditional Validation

```typescript
const itemSchema = z.object({
  status: statusSchema,
  name: requiredString("Name"),
  // Active items require a published URL
  url: z.string().url().optional(),
}).refine(
  (data) => {
    if (data.status === "ACTIVE") {
      return data.url !== undefined;
    }
    return true;
  },
  { message: "Active items require a URL", path: ["url"] }
);
```

### Discriminated Unions

```typescript
const notificationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    email: emailSchema,
    subject: requiredString("Subject"),
  }),
  z.object({
    type: z.literal("sms"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  }),
  z.object({
    type: z.literal("push"),
    deviceToken: z.string().min(1),
  }),
]);
```

## Transform and Preprocess

### Sanitising Input

```typescript
const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(2000, "Comment must be less than 2000 characters")
    .transform((v) => v.trim())
    // Remove potentially dangerous HTML
    .transform((v) => v.replace(/<[^>]*>/g, "")),
});
```

### Coercing Types

```typescript
// Query parameters come as strings, coerce to proper types
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});
```

### Default Values

```typescript
const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.boolean().default(true),
  language: z.string().default("en-GB"),
});
```

## Index File

Re-export all schemas from `lib/schemas/index.ts`:

```typescript
// Base schemas
export * from "./base";

// Domain schemas
export * from "./team";
export * from "./resource-permission";
export * from "./item";

// Common composed schemas
export { paginationSchema } from "./base";
```
