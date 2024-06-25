import { initContract } from '@ts-rest/core';
import { AccountContract } from './account.contract';
import { AuthContract } from './auth.contract';
import { ArticlesContract } from './articles.contract';
import {
  ForbiddenSchema,
  RolesAccess,
  UnauthorizedSchema,
} from '@primaa/blog-types';
import { z } from 'zod';
import { CommentsContract } from './comments.contract';

export type RouteAccessRestrictedTo = Readonly<{
  routeRestrictedTo:
    | {
        roles: RolesAccess[];
      }
    | {
        owner: true;
      }
    | {
        roles: RolesAccess[];
        owner: true;
      };
}>;

const c = initContract();

export const RootContract = c.router(
  {
    account: AccountContract,
    auth: AuthContract,
    articles: ArticlesContract,
    comments: CommentsContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/api',
    commonResponses: {
      ...UnauthorizedSchema.shape,
      ...ForbiddenSchema.shape,
    },
    baseHeaders: z.object({
      authorization: z.string(),
    }),
  }
);
