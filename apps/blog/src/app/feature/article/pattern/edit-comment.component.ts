import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  Comment,
  CommentCreationSchema,
  CommentEditSchema,
} from '@primaa/blog-types';
import { CommentStore } from './comment.store';
import { AccountAuthStore } from '../../../core/auth/account-auth.store';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [CommentStore],
  template: ` @if ($vm(); as vm) { @if(vm.form) {
    <form *ngIf="vm.form" [formGroup]="vm.form">
      <div class="mx-auto container px-4">
        <div class="flex items-end gap-4 flex-col content-end">
          <mat-form-field class="w-full">
            <mat-label>Contenu</mat-label>
            <textarea
              matInput
              placeholder="Ex. 1 - Rédiger du contenu de qualité..."
              formControlName="content"
            ></textarea>
          </mat-form-field>

          <div class="flex gap-2">
            <button mat-button color="primary" (click)="onRemove()">
              Supprimer
            </button>
            <button mat-flat-button color="primary" (click)="onEdit()">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </form>
    } @if(vm.isLoading) { Chargement... } @if(vm.hasError) { Erreur:
    {{ vm.error }}
    } }`,
})
export class EditCommentComponent {
  public articleId = input.required<number>();
  public commentToEdit = input<Comment>();

  private readonly commentStore = inject(CommentStore);
  private readonly accountAuthStore = inject(AccountAuthStore);

  public editedComment = outputFromObservable(this.commentStore.editedComment$);
  public removedComment = outputFromObservable(
    this.commentStore.removedComment$
  );

  protected readonly $vm = toSignal(
    this.commentStore.vm$.pipe(
      map((vm) => {
        const form = vm.result
          ? new FormGroup({
              content: new FormControl(
                vm.result?.comment.content ?? '',
                Validators.required
              ),
            })
          : null;

        return {
          ...vm,
          form,
        } as const;
      })
    )
  );

  constructor() {
    effect(() => {
      const articleId = this.articleId();
      const commentToEdit = this.commentToEdit();

      if (!commentToEdit) {
        this.commentStore.loadComment({
          articleId,
          isCommentCreation: true,
          comment: {
            content: '',
          },
        });
        return;
      }
      this.commentStore.loadComment({
        articleId,
        isCommentCreation: false,
        comment: commentToEdit,
      });
    });
  }

  onEdit() {
    const vm = this.$vm();
    if (!vm || !vm?.isLoaded) {
      return;
    }
    const commentForm = vm?.isLoaded ? vm.form : null;
    const account = this.accountAuthStore.authenticatedUser();
    if (!commentForm || commentForm.invalid || !account) {
      return;
    }
    const currentCommentData = vm.result;

    if (currentCommentData.isCommentCreation) {
      const commentCreation = CommentCreationSchema.safeParse({
        ...commentForm.value,
        authorAccountId: account.id,
      });

      if (!commentCreation.success) {
        console.error(commentCreation.error.errors);
        return;
      }
      this.commentStore.saveEditedComment$({
        isCommentCreation: true,
        comment: commentCreation.data,
        articleId: currentCommentData.articleId,
      });
      return;
    }

    if (!currentCommentData.isCommentCreation && currentCommentData) {
      const commentEdit = CommentEditSchema.safeParse({
        id: currentCommentData.comment.id,
        ...commentForm.value,
        authorAccountId: account.id,
        articleId: currentCommentData.comment.articleId,
      });

      if (!commentEdit.success) {
        console.error(commentEdit.error.errors);
        return;
      }
      this.commentStore.saveEditedComment$({
        isCommentCreation: false,
        comment: commentEdit.data,
        articleId: currentCommentData.articleId,
      });
    }
  }

  onRemove() {
    const comment = this.commentToEdit();
    if (!comment) {
      return;
    }
    this.commentStore.removeComment$(comment.id);
  }
}
