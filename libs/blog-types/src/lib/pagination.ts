import { z } from 'zod';

export const PaginationSchema = z
  .object({
    take: z.string().transform(Number).default('30').catch(30),
    skip: z.string().transform(Number).default('0').catch(0),
    orderBy: z
      .union([z.literal('asc'), z.literal('desc')])
      .optional()
      .default('desc')
      .transform((value) => ({
        id: value,
      })),
  })
  .strict();

export type Pagination = z.infer<typeof PaginationSchema>;
