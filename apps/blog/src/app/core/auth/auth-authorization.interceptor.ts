import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountAuthStore } from './account-auth.store';

export function authAuthorizationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const accountAuthStore = inject(AccountAuthStore);
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accountAuthStore.token()}`,
    },
  });
  return next(req);
}
