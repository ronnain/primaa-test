// // from https://github.com/jacksloan/ts-rest-ng/blob/main/libs/ng-client/src/lib/ng-client.ts

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { lastValueFrom, catchError, of } from 'rxjs';
import { AppRouter, initClient, InitClientArgs } from '@ts-rest/core';

export function initNgClient<
  Router extends AppRouter,
  Args extends InitClientArgs
>(router: Router, args: Args): ReturnType<typeof initClient<Router, Args>> {
  const httpClient = inject(HttpClient);

  const tsRestClient = initClient<Router, Args>(router, {
    ...args,
    api: async ({ path, method, headers, body }) => {
      const response = await lastValueFrom(
        httpClient
          .request(method, `${path}`, {
            headers: { ...args.baseHeaders, ...headers },
            body,
            observe: 'response',
          })
          .pipe(
            catchError((err) =>
              of({
                headers: err.headers,
                body: err.error,
                status: err.status,
              })
            )
          )
      );

      return {
        headers: response.headers,
        body: response.body,
        status: response.status,
      };
    },
  });

  return tsRestClient;
}
