import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  injectQuery,
  injectQueryClient,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { BlogApi } from '../../core/api/blog-api';
import { delay, from, lastValueFrom, map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Pagination } from '@primaa/blog-types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="max-h-mainPageHeight overflow-auto w-full">
      <div class="container">
        <div class="p-4">
          <h1 class="text-2xl">Articles</h1>
        </div>
        <div class="ml-4 space-x-4">
          <button
            mat-flat-button
            (click)="previousPage()"
            [disabled]="page() === 0"
          >
            Précédent
          </button>
          <button
            mat-flat-button
            (click)="nextPage()"
            [disabled]="!query.data()?.hasMore"
          >
            Suivant
          </button>
          @if (query.isFetching() || query.status() === 'pending') {
          <span class="text-xs"> Chargement...</span>
          }
        </div>

        <div class="ml-4">
          <mat-list>
            @for (article of (query.data()?.articles ?? []); track article.id) {
            <mat-list-item>
              <div class="flex w-full justify-between items-center">
                <div>
                  <span class="text-xs">{{ article.id }}:</span>
                  {{ article.title }}
                </div>
                <div class="space-x-2">
                  <button mat-icon-button icon [routerLink]="[article.id]">
                    <mat-icon>remove_red_eye</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    icon
                    [routerLink]="['edit', article.id]"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                </div>
              </div>
            </mat-list-item>
            }
          </mat-list>
        </div>
      </div>
    </div>
  `,
})
export default class ArticlesPageComponent {
  private readonly blogApi = inject(BlogApi);

  protected page = signal(0);

  private offsetPagination = computed(() => {
    return {
      take: 10,
      skip: this.page() * 10,
      orderBy: {
        id: 'desc',
      },
    } satisfies Pagination;
  });

  query = injectQuery(() => ({
    queryKey: ['projects', this.page()],
    queryFn: () =>
      lastValueFrom(
        from(
          this.blogApi.articles.getArticles({
            query: {
              ...this.offsetPagination(),
              orderBy: this.offsetPagination().orderBy.id,
            },
          })
        ).pipe(
          delay(2000), // fake delay
          map((data) => data.body)
        )
      ),
    placeholderData: keepPreviousData,
  }));

  previousPage() {
    this.page.update((old) => Math.max(old - 1, 0));
  }

  nextPage() {
    this.page.update((old) => (this.query.data()?.hasMore ? old + 1 : old));
  }
}
