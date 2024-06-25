import { z } from 'zod';
import { Roles } from './account';

export const UnauthorizedSchema = z.object({
  401: z.null(),
});

export const ForbiddenSchema = z.object({
  403: z.null(),
});

export const RolesAccess = Roles;

export type RolesAccess = (typeof RolesAccess)[number];
