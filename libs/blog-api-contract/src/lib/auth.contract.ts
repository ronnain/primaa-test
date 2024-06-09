
import { CreateAccountSchema, SafeAccountSchema } from '@primaa/blog-types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const AuthContract = c.router({
    createAccount: {
        method: 'POST',
        path: ``,
        responses: {
          201: SafeAccountSchema,
          409: z.object({
            error: z.literal("Account already exists"),
            message: z.literal("An account with this email address already exists.")
          })
        },
        body: CreateAccountSchema,
        summary: 'Add a new account',
    },
    login: {
        method: 'POST',
        path: `/login`,
        responses: {
          200: SafeAccountSchema,
          404: z.object({
            error: z.literal("Not found"),
            message: z.literal("Invalid email or password")
          })
        },
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        summary: 'Login to an account',
    },
}, {
    pathPrefix: '/auth',
    strictStatusCodes: true,
 })