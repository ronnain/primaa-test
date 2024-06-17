import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout.component';

export default <Routes>[
  {
    path: 'articles',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./articles.page'),
      },
    ],
  },
];
