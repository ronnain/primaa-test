import { initContract } from '@ts-rest/core';
import { RoutePartPath } from './route-restrictions';

const c = initContract();

export const AccountContract = c.router(
  {},
  {
    pathPrefix: `/${RoutePartPath.account}`,
    strictStatusCodes: true,
  }
);
