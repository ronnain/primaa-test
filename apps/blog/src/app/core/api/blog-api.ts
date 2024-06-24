import { InjectionToken, inject } from '@angular/core';
import { RootContract } from '@primaa/blog-api-contract';
import { initNgClient } from '../utile/ts-rest-api-config';

export const BlogApi = new InjectionToken(
  'Use this object to call the blog api backend.',
  {
    providedIn: 'root',
    factory: () => {
      const client = initNgClient(RootContract, {
        baseUrl: '',
        baseHeaders: {
          Authorization: `Bearer undefined`, // The token will be replaced after the authentication, but it is needed here for ts-rest contract that requires an authorization token for all routes
          'Content-Type': 'application/json',
        },
      });

      return client;
    },
  }
);
