
import { CreateAccountSchema, SafeAccountSchema } from '@primaa/blog-types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const AccountContract = c.router({
}, {
    pathPrefix: '/accounts',
    strictStatusCodes: true,
 })