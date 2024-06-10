import { InjectionToken, inject } from '@angular/core';
import { RootContract } from '@primaa/blog-api-contract';
import { initClient } from '@ts-rest/core';
import { AuthToken } from '../auth/auth-token';
import { Observable, catchError, defer, lastValueFrom, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const blogApi = new InjectionToken(
  'Use this object to call the blog api backend.',
  {
    providedIn: 'root',
    factory: () => {
      const authToken = inject(AuthToken);
      const httpClient = inject(HttpClient);
      const client = initClient(RootContract, {
        baseUrl: '/api',
        baseHeaders: {
          Authorization: `Bearer ${authToken()}`,
          'Content-Type': 'application/json',
        },
        api: async ({ path, method, headers, body }) => {
          const response = await lastValueFrom(
            httpClient
              .request(method, `${path}`, {
                headers,
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

      return proxyPromiseToObservable(client);
    },
  }
);

function proxyPromiseToObservable<
  T extends ReturnType<typeof initClient<any, any>>
>(client: T): PromiseToObservable<T> {
  return new Proxy(client, {
    get: (target, prop: string) => {
      return prop in target ? proxyPromiseToObservable(target[prop]) : null;
    },
    apply: (target: any, thisArg: any, argArray: any[]) => {
      return defer(() => target(...argArray));
    },
  });
}

type PromiseToObservable<T extends Record<string, any>> = {
  [key in keyof T]: T[key] extends (...args: any[]) => Promise<any>
    ? (...args: Parameters<T[key]>) => Observable<Awaited<ReturnType<T[key]>>>
    : T[key] extends Record<string, any>
    ? PromiseToObservable<T[key]>
    : never;
};
