import { z } from 'zod';

export const UnauthorizedSchema = z.object({
  401: z.null(),
});

export const ForbiddenSchema = z.object({
  403: z.null(),
});
