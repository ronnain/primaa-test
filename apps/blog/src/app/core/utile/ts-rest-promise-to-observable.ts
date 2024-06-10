// // from https://github.com/jacksloan/ts-rest-ng/blob/main/libs/ng-client/src/lib/ng-client.ts

// import { HttpClient } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Observable, lastValueFrom, catchError, of, defer } from 'rxjs';
// import { AppRouter, initClient, InitClientArgs } from '@ts-rest/core';

// type PromiseToObservable<T extends Record<string, any>> = {
//   [key in keyof T]: T[key] extends (...args: any[]) => Promise<any>
//     ? (...args: Parameters<T[key]>) => Observable<Awaited<ReturnType<T[key]>>>
//     : T[key] extends Record<string, any>
//     ? PromiseToObservable<T[key]>
//     : never;
// };

// export type inferNgClient<contract extends AppRouter> = PromiseToObservable<
//   ReturnType<typeof initClient<contract, any>>
// >;

// export function initNgClient<
//   Router extends AppRouter,
//   Args extends InitClientArgs
// >(
//   router: Router,
//   args: Args
// ): PromiseToObservable<ReturnType<typeof initClient<Router, Args>>> {
//   const httpClient = inject(HttpClient);

//   const tsRestClient = initClient<Router, Args>(router, {
//     ...args,
//     api: async ({ path, method, headers, body }) => {
//       const response = await lastValueFrom(
//         httpClient
//           .request(method, `${path}`, {
//             headers: { ...args.baseHeaders, ...headers },
//             body,
//             observe: 'response',
//           })
//           .pipe(
//             catchError((err) =>
//               of({
//                 headers: err.headers,
//                 body: err.error,
//                 status: err.status,
//               })
//             )
//           )
//       );

//       return {
//         headers: response.headers,
//         body: response.body,
//         status: response.status,
//       };
//     },
//   });

//   return proxyPromiseToObservable(tsRestClient);
// }

// function proxyPromiseToObservable<
//   T extends ReturnType<typeof initClient<any, any>>
// >(client: T): PromiseToObservable<T> {
//   return new Proxy(client, {
//     get: (target, prop: string) => {
//       return prop in target ? proxyPromiseToObservable(target[prop]) : null;
//     },
//     apply: (target: any, thisArg: any, argArray: any[]) => {
//       return defer(() => target(...argArray));
//     },
//   });
// }
