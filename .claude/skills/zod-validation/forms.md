# Form Validation Patterns

## Basic Setup

Use `zodResolver` to connect Zod schemas with React Hook Form:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTeamSchema, type CreateTeamInput } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateTeamForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: CreateTeamInput) {
    // data is fully validated and typed
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      onSuccess();
    } else {
      const error = await response.json();
      form.setError("root", { message: error.error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Team"}
        </Button>
      </form>
    </Form>
  );
}
```

## Password Confirmation Pattern

For forms requiring password confirmation:

```typescript
import { z } from "zod";
import { passwordSchema } from "@/lib/schemas/base";

const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error appears on confirmPassword field
  });

type RegisterInput = z.input<typeof registerSchema>;
```

## Edit Form with Partial Validation

For edit forms where fields are optional:

```typescript
import { z } from "zod";
import { createTeamSchema } from "@/lib/schemas";

// Make all fields optional for updates
const updateTeamSchema = createTeamSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined && v !== ""),
  { message: "At least one field must be provided" }
);

export function EditTeamForm({ team, onSuccess }: EditTeamFormProps) {
  const form = useForm<z.input<typeof updateTeamSchema>>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: team.name,
      description: team.description ?? "",
    },
  });

  // Only submit changed fields
  async function onSubmit(data: z.input<typeof updateTeamSchema>) {
    const changedFields: Record<string, unknown> = {};

    if (data.name !== team.name) changedFields.name = data.name;
    if (data.description !== team.description) changedFields.description = data.description;

    if (Object.keys(changedFields).length === 0) {
      return; // No changes
    }

    // Submit only changed fields...
  }
}
```

## Dynamic Field Arrays

For forms with repeating fields:

```typescript
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { emailSchema, permissionLevelSchema } from "@/lib/schemas/base";

const shareResourceSchema = z.object({
  shares: z
    .array(
      z.object({
        email: emailSchema,
        level: permissionLevelSchema,
      })
    )
    .min(1, "Add at least one person")
    .max(10, "Maximum 10 people at once"),
});

export function ShareResourceForm() {
  const form = useForm<z.input<typeof shareResourceSchema>>({
    resolver: zodResolver(shareResourceSchema),
    defaultValues: {
      shares: [{ email: "", level: "VIEW" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "shares",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={form.control}
              name={`shares.${index}.email`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`shares.${index}.level`}
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEW">View</SelectItem>
                      <SelectItem value="COMMENT">Comment</SelectItem>
                      <SelectItem value="EDIT">Edit</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ email: "", level: "VIEW" })}
          disabled={fields.length >= 10}
        >
          Add Person
        </Button>

        <Button type="submit">Share</Button>
      </form>
    </Form>
  );
}
```

## Server-Side Error Handling

Handle API validation errors in the form:

```typescript
async function onSubmit(data: CreateTeamInput) {
  try {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle field-specific errors from API
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof CreateTeamInput, {
            type: "server",
            message: message as string,
          });
        }
        return;
      }

      // Handle general error
      form.setError("root", {
        type: "server",
        message: result.error || "Something went wrong",
      });
      return;
    }

    onSuccess(result);
  } catch (error) {
    form.setError("root", {
      type: "server",
      message: "Network error. Please try again.",
    });
  }
}
```

## Async Validation (Debounced)

For validations that require API calls (e.g., checking username availability):

```typescript
import { z } from "zod";
import { usernameSchema } from "@/lib/schemas/base";

// Schema with async refinement
const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// In the form component, use manual validation
export function RegisterForm() {
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const form = useForm<z.input<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  // Debounced username check
  const checkUsername = useDebouncedCallback(async (username: string) => {
    if (username.length < 2) return;

    setCheckingUsername(true);
    try {
      const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
      const result = await response.json();

      if (!result.available) {
        setUsernameError("This username is already taken");
        form.setError("username", { message: "This username is already taken" });
      } else {
        setUsernameError(null);
        form.clearErrors("username");
      }
    } finally {
      setCheckingUsername(false);
    }
  }, 500);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  checkUsername(e.target.value);
                }}
              />
            </FormControl>
            {checkingUsername && <p className="text-sm text-muted-foreground">Checking availability...</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
```

## Form State Helpers

Common patterns for handling form state:

```typescript
function MyForm() {
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const {
    formState: {
      isSubmitting,     // true while onSubmit is running
      isValid,          // true if all fields pass validation
      isDirty,          // true if any field has changed
      errors,           // object containing all errors
      dirtyFields,      // object with fields that changed
    },
    reset,              // Reset form to default values
    setValue,           // Programmatically set a field value
    watch,              // Subscribe to field value changes
    trigger,            // Manually trigger validation
  } = form;

  // Watch specific field
  const teamName = watch("name");

  // Reset form after successful submission
  const onSuccess = () => {
    reset();
    // or reset with new values
    reset({ name: "", description: "" });
  };

  // Disable submit if form is invalid or unchanged
  const canSubmit = isDirty && isValid && !isSubmitting;

  return (
    <Button type="submit" disabled={!canSubmit}>
      {isSubmitting ? "Saving..." : "Save"}
    </Button>
  );
}
```
