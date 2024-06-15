import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CreateAccount, LoginAccount, SafeAccount } from '@primaa/blog-types';
import { AuthService } from './auth-api.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { statedStream } from '../rxjs/stated-stream';

export type StatedData<T> =
  | {
      readonly isLoading: false;
      readonly isAuthenticated: false;
    }
  | {
      readonly isLoading: false;
      readonly isAuthenticated: true;
      readonly authenticatedUser: T;
    }
  | {
      readonly isLoading: true;
      readonly isAuthenticated: false;
    };

type UserAuthState = StatedData<SafeAccount>;

const initialState: UserAuthState = {
  isLoading: false,
  isAuthenticated: false,
};

export const AccountAuthStore = signalStore(
  { providedIn: 'root' },
  withState<UserAuthState>(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    createAccount: (accountToCreate: CreateAccount) =>
      statedStream(authService.createAccount(accountToCreate)).pipe(
        tap({
          next: (data) => {
            if (data.isLoading) {
              patchState(store, {
                isLoading: true,
                isAuthenticated: false,
              });
              return;
            }
            if (data.hasError) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: false,
              });
              return;
            }

            if (data.isLoaded) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: true,
                authenticatedUser: data.result,
              });
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
              });
              return;
            }
            if (data.hasError) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: false,
              });
              return;
            }

            if (data.isLoaded) {
              patchState(store, {
                isLoading: false,
                isAuthenticated: true,
                authenticatedUser: data.result,
              });
              return;
            }
          },
        })
      ),
  }))
  // todo add effect to store token when login
);
