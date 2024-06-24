import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Subject,
  from,
  repeat,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { BlogApi } from '../../core/api/blog-api';
import { EditCommentComponent } from './pattern/edit-comment.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditComment } from './pattern/comment.store';
import { AccountAuthStore } from '../../core/auth/account-auth.store';
import { CommentWithAuthor } from '@primaa/blog-types';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  EditCommentDialogComponent,
  provideEditCommentDialogData,
} from './pattern/edit-comment-dialog.component';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [
    CommonModule,
    EditCommentComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  template: `
    <div class="max-h-mainPageHeight overflow-auto w-full space-y-4">
      <div class="container mx-auto space-y-6">
        @if ($error()) {
        {{ $error() }}
        } @if ($articleData(); as articleData) {
        <div class="p-4">
          <h1 class="text-2xl">{{ articleData.title }}</h1>
          <div class="text-xs text-secondary-shade-50">
            Par: {{ articleData.account.email }}
          </div>
        </div>

        <div class="mx-4">
          {{ articleData.content }}
        </div>

        <div class="mx-4 space-y-4">
          <div class="">Commentaires:</div>
          <div class="">
            <button
              mat-stroked-button
              (click)="toggleAddComment$.next(!toggleAddComment$.getValue())"
              color="accent"
            >
              Ajouter un commentaire
            </button>
          </div>
          <div class="">
            @if (toggleAddComment$ | async) {
            <app-edit-comment
              [articleId]="articleIdNumber()"
              (editedComment)="onEditedComment()"
            />
            }
          </div>

          @for (comment of articleData.comments; track comment.id;) {
          <div class="mx-4 mb-2 text-secondary-shade-50 flex justify-between">
            <div class="flex-1">
              <div class="text-xs flex items-center">
                <mat-icon>person_pin</mat-icon>
                <span>{{ comment.account.email }}</span>
              </div>
              <div>{{ comment.content }}</div>
            </div>

            <div>
              @if(isAdmin() || currentAccountId() === comment.account.id) {
              <button
                mat-icon-button
                color="accent"
                #editComment
                (click)="onEditComment(comment)"
              >
                <mat-icon>edit</mat-icon>
              </button>
              }
            </div>
          </div>
          }
        </div>
        }
      </div>
    </div>
  `,
})
export default class ArticleDetailsComponent {
  private readonly blogApi = inject(BlogApi);
  private readonly accountAuthStore = inject(AccountAuthStore);
  private readonly matDialog = inject(MatDialog);
  protected articleId = input.required<string>();
  protected articleIdNumber = computed(() => parseInt(this.articleId(), 10));

  private readonly refreshPage$ = new Subject<void>();

  private $articleWithAuthorWithComments = toSignal(
    toObservable(this.articleId).pipe(
      switchMap((articleId) =>
        this.blogApi.articles.getArticle({
          params: {
            articleId,
          },
        })
      ),
      take(1),
      repeat({
        delay: () => this.refreshPage$,
      })
    )
  );

  protected $error = computed(() => {
    const articleWithAuthorWithComments = this.$articleWithAuthorWithComments();
    if (!articleWithAuthorWithComments) {
      return undefined;
    }
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

  protected readonly toggleAddComment$ = new BehaviorSubject<boolean>(false);

  protected onEditedComment() {
    this.toggleAddComment$.next(false);
    this.refreshPage$.next(); // Will refresh the page, but it can be optimized by manually adding the edited comment.
  }

  protected onEditComment(comment: CommentWithAuthor) {
    const editCommentDialog = this.matDialog.open(EditCommentDialogComponent, {
      data: provideEditCommentDialogData({
        articleId: this.articleIdNumber(),
        comment,
      }),
    });
    editCommentDialog.afterClosed().subscribe(() => this.refreshPage$.next());
  }

  protected isAdmin = this.accountAuthStore.isAdmin;

  protected currentAccountId = computed(
    () => this.accountAuthStore.authenticatedUser()?.id
  );
}
