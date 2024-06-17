import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CreateAccount, LoginAccount, SafeAccount } from '@primaa/blog-types';
import { AuthService } from './auth-api.service';
import { effect, inject } from '@angular/core';
import { tap } from 'rxjs';
import { statedStream } from '../rxjs/stated-stream';
import { STATE_SIGNAL } from '@ngrx/signals/src/state-signal';

export type StatedData<T> =
  | {
      readonly isLoading: false;
      readonly isAuthenticated: false;
      readonly authenticatedUser: undefined;
      readonly token: undefined;
    }
  | {
      readonly isLoading: false;
      readonly isAuthenticated: true;
      readonly authenticatedUser: T;
      readonly token: string;
    }
  | {
      readonly isLoading: true;
      readonly isAuthenticated: false;
      readonly authenticatedUser: undefined;
      readonly token: undefined;
    };

type AccountAuthState = StatedData<SafeAccount>;

const clientStorage = localStorage;
const tokenKey = 'primaaToken';
const accountKey = 'primaaAccount';

export const AccountAuthStore = signalStore(
  { providedIn: 'root' },
  withState<AccountAuthState>(getInitialAccountAuthState()),
  withMethods((store, authService = inject(AuthService)) => ({
    createAccount: (accountToCreate: CreateAccount) =>
      statedStream(authService.createAccount(accountToCreate)).pipe(
        tap({
          next: (data) => {
            if (data.isLoading) {
              patchState(store, {
                isLoading: true,
                isAuthenticated: false,
                authenticatedUser: undefined,
                token: undefined,
              } as const);
              return;
            }
            if (data.hasError) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: false,
                authenticatedUser: undefined,
                token: undefined,
              } as const);
              return;
            }

            if (data.isLoaded) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: true,
                authenticatedUser: data.result.account,
                token: data.result.token,
              } as const);
              return;
            }
          },
        })
      ),
    login: (loginAccount: LoginAccount) =>
      statedStream(authService.login(loginAccount)).pipe(
        tap({
          next: (data) => {
            if (data.isLoading) {
              patchState(store, {
                isLoading: true,
                isAuthenticated: false,
                authenticatedUser: undefined,
                token: undefined,
              } as const);
              return;
            }
            if (data.hasError) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: false,
                authenticatedUser: undefined,
                token: undefined,
              } as const);
              return;
            }

            if (data.isLoaded) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: true,
                authenticatedUser: data.result.account,
                token: data.result.token,
              } as const);
              return;
            }
          },
        })
      ),
  })),
  withHooks({
    onInit: (store) => {
      effect(() => {
        const token = store.token();
        token
          ? clientStorage.setItem(tokenKey, JSON.stringify(token))
          : clientStorage.removeItem(tokenKey);

        const account = store.authenticatedUser();
        account
          ? clientStorage.setItem(accountKey, JSON.stringify(account))
          : clientStorage.removeItem(accountKey);
      });
    },
  })
);

function getInitialAccountAuthState(): AccountAuthState {
  const token = clientStorage.getItem(tokenKey);
  const account = clientStorage.getItem(accountKey);
  if (!token || !account) {
    return {
      isLoading: false,
      authenticatedUser: undefined,
      isAuthenticated: false,
      token: undefined,
    };
  }
  return {
    isLoading: false,
    isAuthenticated: true,
    authenticatedUser: JSON.parse(account),
    token: JSON.parse(token),
  };
}
