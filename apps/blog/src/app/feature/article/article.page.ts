import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { BlogApi } from '../../core/api/blog-api';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-h-mainPageHeight overflow-auto w-full space-y-4">
      <div class="container">
        @if ($error()) {
        {{ $error() }}
        } @if ($articleData(); as articleData) {
        <div>
          <h1 class="text-2xl">{{ articleData.title }}</h1>
        </div>
        <div class="mx-4">Auteur: {{ articleData.account.email }}</div>

        <div class="mx-4">
          <pre>{{ articleData.content }}</pre>
        </div>

        <div class="mx-4">
          Commentaires: @for (comment of articleData.comments; track comment.id)
          {
          <div class="mx-4">
            <div>{{ comment.account.email }}</div>
            <div>{{ comment.content }}</div>
          </div>
          }
        </div>
        }
      </div>
    </div>
  `,
})
export default class ArticleComponent {
  private readonly blogApi = inject(BlogApi);
  protected articleId = input.required<string>();

  private $articleWithAuthorWithComments = toSignal(
    toObservable(this.articleId).pipe(
      switchMap((articleId) =>
        this.blogApi.articles.getArticle({
          params: {
            articleId,
          },
        })
      )
    )
  );

  protected $error = computed(() => {
    const articleWithAuthorWithComments = this.$articleWithAuthorWithComments();
    if (articleWithAuthorWithComments?.status === 404) {
      return "L'article n'existe pas";
    }
    if (articleWithAuthorWithComments?.status !== 200) {
      return "Une erreur est survenue lors de la récupération de l'article";
    }
    return undefined;
  });

  protected $articleData = computed(() => {
    const articleWithAuthorWithComments = this.$articleWithAuthorWithComments();
    if (articleWithAuthorWithComments?.status !== 200) {
      return undefined;
    }
    return articleWithAuthorWithComments.body;
  });
}
