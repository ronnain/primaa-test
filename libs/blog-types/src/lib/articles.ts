import { z } from 'zod';

export const ArticleCreationSchema = z.object({
  title: z.string(),
  content: z.string(),
  // authorAccountId: z.number(),
});
export type ArticleCreation = z.infer<typeof ArticleCreationSchema>;

export const ArticleSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  content: z.string(),
  authorAccountId: z.number(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const ArticleEditSchema = ArticleSchema.omit({
  createdAt: true,
  updatedAt: true,
});
export type ArticleEdit = z.infer<typeof ArticleEditSchema>;
