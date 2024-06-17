import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./feature/auth/auth.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./feature/article/article.routes'),
  },
];
