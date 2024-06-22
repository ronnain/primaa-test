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
      {
        path: 'edit',
        loadComponent: () => import('./edit-article.page'),
      },
      {
        path: 'edit/:articleId',
        loadComponent: () => import('./edit-article.page'),
      },
      {
        path: 'details/:articleId',
        loadComponent: () => import('./article-details.page'),
      },
    ],
  },
];
