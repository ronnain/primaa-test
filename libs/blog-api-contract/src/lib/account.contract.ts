import { initContract } from '@ts-rest/core';

const c = initContract();

export const AccountContract = c.router(
  {},
  {
    pathPrefix: '/accounts',
    strictStatusCodes: true,
  }
);
