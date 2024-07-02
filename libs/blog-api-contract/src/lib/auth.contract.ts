import {
  CreateAccountSchema,
  JWTSchema,
  LoginAccountSchema,
  SafeAccountSchema,
} from '@primaa/blog-types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { RoutePartPath } from './route-restrictions';

const c = initContract();

export const AuthContract = c.router(
  {
    createAccount: {
      method: 'POST',
      path: ``,
      responses: {
        201: z
          .object({
            account: SafeAccountSchema,
          })
          .merge(JWTSchema),
        409: z.object({
          error: z.literal('Account already exists'),
          message: z.literal(
            'An account with this email address already exists.'
          ),
        }),
      },
      body: CreateAccountSchema,
      summary: 'Add a new account',
    },
    login: {
      method: 'POST',
      path: `/login`,
      responses: {
        200: z
          .object({
            account: SafeAccountSchema,
          })
          .merge(JWTSchema),
        404: z.object({
          error: z.literal('Not found'),
          message: z.literal('Invalid email or password'),
        }),
      },
      body: LoginAccountSchema,
      summary: 'Login to an account',
    },
  },
  {
    pathPrefix: `/${RoutePartPath.auth}`,
    strictStatusCodes: true,
  }
);
