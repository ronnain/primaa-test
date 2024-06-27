import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  Observable,
  Subject,
  from,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { StatedData } from '../../../core/utile/stated-data';
import { BlogApi } from '../../../core/api/blog-api';
import { CommentCreation, CommentEdit, Comment } from '@primaa/blog-types';

export type EditComment =
  | {
      isCommentCreation: true;
      comment: CommentCreation;
      articleId: number;
    }
  | {
      isCommentCreation: false;
      comment: CommentEdit;
      articleId: number;
    };

export type CommentEditionState = StatedData<EditComment>;

@Injectable()
export class CommentStore extends ComponentStore<CommentEditionState> {
  private readonly blogApi = inject(BlogApi);

  constructor() {
    super({
      isLoaded: false,
      isLoading: true,
      hasError: false,
      error: undefined,
      result: undefined,
    });
  }

  public readonly vm$ = this.select((state) => state, { debounce: true });
  public readonly editedComment$ = new Subject<EditComment>();
  public readonly removedComment$ = new Subject<Comment>();

  private readonly setLoaded = this.updater(
    (state, commentData: NonNullable<CommentEditionState['result']>) => ({
      isLoaded: true,
      isLoading: false,
      hasError: false,
      error: undefined,
      result: commentData,
    })
  );

  private readonly setStoring = this.updater(
    (state, commentData: EditComment) => {
      return {
        isLoaded: false,
        isLoading: true,
        hasError: false,
        error: undefined,
        result: commentData,
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
    (state, error: NonNullable<CommentEditionState['error']>) => ({
      isLoaded: false,
      isLoading: false,
      hasError: true,
      error: error,
      result: undefined,
    })
  );

  public readonly setCommentCreation = this.updater(() => ({
    isLoaded: false,
    isLoading: true,
    hasError: false,
    error: undefined,
    result: undefined,
  }));

  public readonly loadComment = (commentData: EditComment) => {
    this.setLoaded(commentData);
  };

  public readonly saveEditedComment$ = this.effect(
    (commentData$: Observable<EditComment>) =>
      commentData$.pipe(
        tap((commentData) => {
          if (commentData.isCommentCreation) {
            this.setStoring(commentData);
            return;
          }
          const currentCommentData = this.get((state) => state.result?.comment);
          if (!currentCommentData || !('id' in currentCommentData)) {
            return; // should not happen
          }
          this.setStoring({
            isCommentCreation: commentData.isCommentCreation,
            comment: {
              ...currentCommentData,
              ...commentData.comment,
            },
            articleId: currentCommentData.articleId,
          });
        }),
        switchMap((commentData) => {
          if (commentData.isCommentCreation) {
            return from(
              this.blogApi.comments.createComment({
                params: {
                  articleId: `${commentData.articleId}`,
                },
                body: commentData.comment,
              })
            );
          }
          return from(
            this.blogApi.comments.saveComment({
              params: {
                commentId: '' + commentData.comment.id,
                articleId: `${commentData.articleId}`,
              },
              body: commentData.comment,
            })
          );
        }),
        tap((commentData) => {
          if (commentData.status === 201) {
            const commentEdited = {
              isCommentCreation: false,
              comment: commentData.body,
              articleId: commentData.body.articleId,
            };
            this.setLoaded(commentEdited);
            this.editedComment$.next({
              ...commentEdited,
              isCommentCreation: true,
            });
            return;
          }
          if (commentData.status === 200) {
            const commentEdited = {
              isCommentCreation: false,
              comment: commentData.body,
              articleId: commentData.body.articleId,
            };
            this.setLoaded(commentEdited);
            this.editedComment$.next(commentEdited);
            return;
          }
          if (commentData.status === 404) {
            this.setError('Comment non trouvé');
            return;
          }
          this.setError("Erreur lors de la sauvegarde de l'comment");
        })
      )
  );

  public readonly removeComment$ = this.effect(
    (commentId$: Observable<number>) =>
      commentId$.pipe(
        tap(() => this.setLoading()),
        mergeMap((commentId) => {
          return from(
            this.blogApi.comments.removeComment({
              params: {
                commentId: '' + commentId,
              },
            })
          );
        }),
        take(1),
        map((commentData) => {
          if (commentData.status === 204) {
            this.setCommentCreation();
            this.removedComment$.next(commentData.body);
            return true;
          }
          if (commentData.status === 404) {
            this.setError('Commentaire non trouvé');
            return false;
          }
          this.setError("Erreur lors de la suppression de l'article");
          return false;
        })
      )
  );
}
