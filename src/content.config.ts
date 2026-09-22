import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seoFields = {
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalPath: z.string().optional(),
  noindex: z.boolean().default(true)
};

const teacherResources = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/teacher-resources'
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    resourceType: z.enum([
      'handbook-summary',
      'policy-guide',
      'recital-info',
      'parent-communication',
      'opus-guide',
      'what-to-do-when',
      'onboarding',
      'culture-training',
      'other'
    ]).default('other'),
    visibility: z.enum(['public', 'internal', 'private']).default('internal'),
    status: z.enum(['draft', 'published']).default('draft'),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    audience: z.array(z.string()).default(['Teachers']),
    publishDate: z.date().optional(),
    lastUpdated: z.date().optional(),
    related: z.array(z.string()).default([]),
    ...seoFields
  })
});

export const collections = {
  'teacher-resources': teacherResources
};
