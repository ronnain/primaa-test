import { z } from 'zod';
import { SafeAccountSchema } from './account';

export const CommentSchema = z.object({
  id: z.number(),
  articleId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  content: z.string(),
  authorAccountId: z.number(),
});

export type Comment = z.infer<typeof CommentSchema>;

export const CommentWithAuthorSchema = CommentSchema.extend({
  account: SafeAccountSchema.pick({ email: true }),
});
export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;

export const CommentCreationSchema = z.object({
  content: z.string(),
});
export type CommentCreation = z.infer<typeof CommentCreationSchema>;
