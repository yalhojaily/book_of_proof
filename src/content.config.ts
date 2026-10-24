import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    chapter: z.string(), // chapter slug, e.g. "sets"
    section: z.string(), // section id, e.g. "1.1"
    summary: z.string(),
    goals: z.array(z.string()).default([]),
    terms: z.array(z.object({ ar: z.string(), en: z.string(), tex: z.string().optional() })).default([]),
    exercises: z.string().optional(), // pointer to the book's exercises
  }),
});

export const collections = { lessons };
