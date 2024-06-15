import { InjectionToken, inject } from '@angular/core';
import { RootContract } from '@primaa/blog-api-contract';
import { initClient } from '@ts-rest/core';
import { AuthToken } from '../auth/auth-token';

export const BlogApi = new InjectionToken(
  'Use this object to call the blog api backend.',
  {
    providedIn: 'root',
    factory: () => {
      const authToken = inject(AuthToken);
      const client = initClient(RootContract, {
        baseUrl: '',
        baseHeaders: {
          Authorization: `Bearer ${authToken()}`,
          'Content-Type': 'application/json',
        },
      });

      return client;
    },
  }
);
