import {
  CommentCreationSchema,
  CommentEditSchema,
  CommentSchema,
} from '@primaa/blog-types';
import { initContract } from '@ts-rest/core';
import { RoutePartPath } from './route-restrictions';
import { provideMetadataRouteConfig } from './util';

const c = initContract();

export const CommentsContract = c.router(
  {
    createComment: {
      method: 'POST',
      path: `/articles/:articleId`,
      responses: {
        201: CommentSchema,
      },
      body: CommentCreationSchema,
      summary: 'Add a new comment',
    },
    saveComment: {
      method: 'PUT',
      path: `/:commentId/articles/:articleId`,
      responses: {
        200: CommentSchema,
        404: null,
      },
      metadata: provideMetadataRouteConfig({
        routeRestrictedTo: {
          roles: ['ADMIN'],
          owner: true,
        },
      } as const),
      body: CommentEditSchema,
    },
    removeComment: {
      method: 'PUT',
      path: `/:commentId`,
      responses: {
        204: CommentSchema,
        404: null,
      },
      metadata: provideMetadataRouteConfig({
        routeRestrictedTo: {
          roles: ['ADMIN'],
          owner: true,
        },
      } as const),
      body: null,
    },
  },
  {
    pathPrefix: `/${RoutePartPath.comments}`,
  }
);
