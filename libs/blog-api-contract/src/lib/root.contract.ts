import { initContract } from '@ts-rest/core';
import { AccountContract } from './account.contract';
import { AuthContract } from './auth.contract';
import { ArticlesContract } from './articles.contract';
import { ForbiddenSchema, UnauthorizedSchema } from '@primaa/blog-types';
import { z } from 'zod';
import { CommentsContract } from './comments.contract';
import { RoutePartPath } from './route-restrictions';

const c = initContract();

export const RootContract = c.router(
  {
    [RoutePartPath.account]: AccountContract,
    [RoutePartPath.auth]: AuthContract,
    [RoutePartPath.articles]: ArticlesContract,
    [RoutePartPath.comments]: CommentsContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: `/${RoutePartPath.root}`,
    commonResponses: {
      ...UnauthorizedSchema.shape,
      ...ForbiddenSchema.shape,
    },
    baseHeaders: z.object({
      authorization: z.string(),
    }),
  }
);
