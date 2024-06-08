
import { initContract } from '@ts-rest/core';

const c = initContract();

export const AccountContract = c.router({
    createAccount: {
        method: 'POST',
        path: ``,
        responses: {
          201: SafeClientAccountSchema,
          404: null
        },
        body: AccountCreateInputSchema,
        summary: 'Add a new account',
    },
}, {
    pathPrefix: '/accounts',
    strictStatusCodes: true,
 })