import { z } from 'zod';
import { CommentWithAuthorSchema } from './comment';
import { AccountSchema, SafeAccountSchema } from './account';

export const ArticleCreationSchema = z.object({
  title: z.string(),
  content: z.string(),
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

export const ArticleWithAuthorWithCommentsSchema = ArticleSchema.extend({
  account: SafeAccountSchema.pick({ email: true }),
  comments: CommentWithAuthorSchema.array(),
});

export const ArticleEditSchema = ArticleSchema.omit({
  createdAt: true,
  updatedAt: true,
});
export type ArticleEdit = z.infer<typeof ArticleEditSchema>;
