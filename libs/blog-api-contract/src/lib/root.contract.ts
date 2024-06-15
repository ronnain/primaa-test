import { initContract } from '@ts-rest/core';
import { AccountContract } from './account.contract';
import { AuthContract } from './auth.contract';

const c = initContract();

export const RootContract = c.router(
  {
    account: AccountContract,
    auth: AuthContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/api',
  }
);
