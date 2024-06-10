import { Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../../layout/empty-layout.component';

export default <Routes>[
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: () => import('./login.page'),
      },
      {
        path: 'register',
        loadComponent: () => import('./account-creation.page'),
      },
    ],
  },
];
