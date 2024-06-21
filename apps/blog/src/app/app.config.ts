import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authAuthorizationInterceptor } from './core/auth/auth-authorization.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // try to use this one
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authAuthorizationInterceptor])),
    provideAnimationsAsync(),
  ],
};
