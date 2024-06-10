import { InjectionToken } from '@angular/core';

const AUTH_TOKEN_KEY = 'auth-token';

export const AuthToken = new InjectionToken('Auth token for the blog app', {
  providedIn: 'root',
  factory: () => {
    return () => {
      console.log('AUTH_TOKEN_KEY', AUTH_TOKEN_KEY); // todo check if it is call each times
      return localStorage.getItem(AUTH_TOKEN_KEY);
    };
  },
});
