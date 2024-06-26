import {
  ArticleCreationSchema,
  ArticleEditSchema,
  ArticleSchema,
  ArticleWithAuthorWithCommentsSchema,
  PaginationSchema,
} from '@primaa/blog-types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { provideMetadataRouteConfig } from './util';
import { RoutePartPath } from './route-restrictions';

const c = initContract();

export const ArticlesContract = c.router(
  {
    createArticle: {
      method: 'POST',
      path: ``,
      responses: {
        201: ArticleSchema,
      },
      body: ArticleCreationSchema,
      summary: 'Add a new article',
    },
    saveArticle: {
      method: 'PUT',
      path: `/:articleId`,
      responses: {
        200: ArticleSchema,
        404: null,
      },
      body: ArticleEditSchema,
      metadata: provideMetadataRouteConfig({
        routeRestrictedTo: {
          roles: ['ADMIN'],
          owner: true,
        },
      } as const),
      summary: 'Edit an article',
    },
    getArticle: {
      method: 'GET',
      path: `/:articleId`,
      responses: {
        200: ArticleWithAuthorWithCommentsSchema,
        404: null,
      },
      summary: 'Get an article by id',
    },
    getArticles: {
      method: 'GET',
      path: '',
      responses: {
        200: z.object({
          articles: ArticleSchema.array(),
          hasMore: z.boolean(),
        }),
      },
      summary: 'Get all articles',
      query: PaginationSchema,
    },
    removeArticle: {
      method: 'DELETE',
      path: '/:articleId',
      metadata: provideMetadataRouteConfig({
        routeRestrictedTo: {
          roles: ['ADMIN'],
          owner: true,
        },
      } as const),
      body: null,
      responses: {
        204: ArticleSchema,
        404: null,
      },
      summary: 'Remove an article',
    },
  },
  {
    pathPrefix: `/${RoutePartPath.articles}`,
  }
);
