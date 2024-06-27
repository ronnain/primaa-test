import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditCommentComponent } from './edit-comment.component';
import { Comment } from '@primaa/blog-types';

export type EditCommentDialogData = {
  comment: Comment;
  articleId: number;
};

export function provideEditCommentDialogData(data: EditCommentDialogData) {
  return data;
}

@Component({
  selector: 'app-edit-comment-dialog',
  standalone: true,
  imports: [CommonModule, EditCommentComponent],
  template: `
    <div class="p-4">
      <app-edit-comment
        [articleId]="data.articleId"
        [commentToEdit]="data.comment"
        (editedComment)="onEditedComment()"
        (removedComment)="onRemoveComment()"
      />
    </div>
  `,
})
export class EditCommentDialogComponent {
  protected readonly data: EditCommentDialogData = inject(MAT_DIALOG_DATA);
  private readonly matDialogRef: MatDialogRef<EditCommentDialogComponent> =
    inject(MatDialogRef);

  protected onEditedComment() {
    this.matDialogRef.close();
  }

  protected onRemoveComment() {
    this.matDialogRef.close();
  }
}
