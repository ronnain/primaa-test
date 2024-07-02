import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Article, ArticleCreation, ArticleEdit } from '@primaa/blog-types';
import { Observable, filter, from, map, switchMap, take, tap } from 'rxjs';
import { BlogApi } from '../../core/api/blog-api';
import { StatedData } from '../../core/util/stated-data';

type ArticleEditState =
  | {
      isArticleCreation: true;
      article: ArticleCreation;
    }
  | {
      isArticleCreation: false;
      article: Article;
    };

export type ArticleEditionState = StatedData<ArticleEditState>;

@Injectable()
export class ArticleStore extends ComponentStore<ArticleEditionState> {
  private readonly blogApi = inject(BlogApi);

  constructor() {
    super({
      isLoaded: true,
      isLoading: false,
      hasError: false,
      error: undefined,
      result: {
        isArticleCreation: true,
        article: {
          title: '',
          content: '',
        },
      },
    });
  }

  public readonly vm$ = this.select((state) => state, { debounce: true });

  private readonly setLoaded = this.updater(
    (state, articleData: NonNullable<ArticleEditionState['result']>) => ({
      isLoaded: true,
      isLoading: false,
      hasError: false,
      error: undefined,
      result: articleData,
    })
  );

  private readonly setStoring = this.updater(
    (state, articleData: ArticleEditState) => {
      return {
        isLoaded: false,
        isLoading: true,
        hasError: false,
        error: undefined,
        result: articleData,
      };
    }
  );

  private readonly setLoading = this.updater(() => ({
    isLoaded: false,
    isLoading: true,
    hasError: false,
    error: undefined,
    result: undefined,
  }));

  private readonly setError = this.updater(
    (state, error: NonNullable<ArticleEditionState['error']>) => ({
      isLoaded: false,
      isLoading: false,
      hasError: true,
      error: error,
      result: undefined,
    })
  );

  public readonly setArticleCreation = this.updater(() => ({
    isLoaded: true,
    isLoading: false,
    hasError: false,
    error: undefined,
    result: {
      isArticleCreation: true,
      article: {
        title: '',
        content: '',
      },
    },
  }));

  public readonly loadArticle$ = this.effect((articleId$: Observable<number>) =>
    articleId$.pipe(
      filter(
        (articleId) =>
          articleId !==
          this.get((state) =>
            state.result && !state.result.isArticleCreation
              ? state.result.article.id
              : undefined
          )
      ),
      tap(() => {
        this.setLoading();
      }),
      switchMap((articleId) =>
        from(
          this.blogApi.articles.getArticle({
            params: {
              articleId: '' + articleId,
            },
          })
        ).pipe(
          tap((articleData) => {
            if (articleData.status === 200) {
              this.setLoaded({
                isArticleCreation: false,
                article: articleData.body,
              });
              return;
            }
            if (articleData.status === 404) {
              this.setError('Article non trouvé');
              return;
            }
            this.setError("Erreur lors du chargement de l'article");
            return;
          })
        )
      )
    )
  );

  public readonly saveEditedArticle$ = this.effect(
    (
      articleData$: Observable<
        | {
            isArticleCreation: true;
            article: ArticleCreation;
          }
        | {
            isArticleCreation: false;
            article: ArticleEdit;
          }
      >
    ) =>
      articleData$.pipe(
        tap((articleData) => {
          if (articleData.isArticleCreation) {
            this.setStoring(articleData);
            return;
          }
          const currentArticleData = this.get((state) => state.result?.article);
          if (!currentArticleData || !('id' in currentArticleData)) {
            return; // should not happen
          }
          this.setStoring({
            isArticleCreation: articleData.isArticleCreation,
            article: {
              ...currentArticleData,
              ...articleData.article,
            },
          });
        }),
        switchMap((articleData) => {
          if (articleData.isArticleCreation) {
            return from(
              this.blogApi.articles.createArticle({
                body: articleData.article,
              })
            );
          }
          return from(
            this.blogApi.articles.saveArticle({
              params: { articleId: '' + articleData.article.id },
              body: articleData.article,
            })
          );
        }),
        tap((articleData) => {
          if (articleData.status === 200 || articleData.status === 201) {
            this.setLoaded({
              isArticleCreation: false,
              article: articleData.body,
            });
            return;
          }
          if (articleData.status === 404) {
            this.setError('Article non trouvé');
            return;
          }
          this.setError("Erreur lors de la sauvegarde de l'article");
        })
      )
  );

  public readonly removeArticle$ = (articleId: number) => {
    this.setLoading();
    return from(
      this.blogApi.articles.removeArticle({
        params: {
          articleId: '' + articleId,
        },
      })
    ).pipe(
      take(1),
      map((articleData) => {
        if (articleData.status === 204) {
          this.setArticleCreation();
          return true;
        }
        if (articleData.status === 404) {
          this.setError('Article non trouvé');
          return false;
        }
        this.setError("Erreur lors de la sauvegarde de l'article");
        return false;
      })
    );
  };
}
