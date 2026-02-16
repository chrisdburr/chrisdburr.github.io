import { z } from "zod";

export const researchAreaSchema = z.object({
  title: z.string(),
  description: z.string(),
  field: z.string(),
  iconName: z.string(),
});

export const projectSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  description: z.string(),
  active: z.boolean(),
});

export const publicationSchema = z.object({
  title: z.string(),
  authors: z.string(),
  journal: z.string(),
  time: z.string(),
  link: z.string().url().optional(),
  abstract: z.string().optional(),
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Publication = z.infer<typeof publicationSchema>;
