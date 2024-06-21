import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AccountAuthStore } from '../../core/auth/account-auth.store';
import { ArticleCreationSchema, ArticleEditSchema } from '@primaa/blog-types';
import { ArticleStore } from './article.store.';

@Component({
  selector: 'app-edit-article-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [ArticleStore],
  template: `
    <div class="container p-4">
      <h1 class="text-2xl">Editer un article</h1>
    </div>
    @if ($vm(); as vm) { @if(vm.form) {
    <form *ngIf="vm.form" [formGroup]="vm.form">
      <div class="container mx-auto px-4">
        <div class="flex items-end gap-4 flex-col content-end">
          <mat-form-field class="w-full">
            <mat-label>Titre</mat-label>
            <input
              matInput
              placeholder="Ex. 5 clés pour un article de qualité"
              formControlName="title"
            />
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Contenu</mat-label>
            <textarea
              matInput
              placeholder="Ex. 1 - Rédiger du contenu de qualité..."
              formControlName="content"
            ></textarea>
          </mat-form-field>

          <button mat-flat-button color="primary" (click)="onEdit()">
            Sauvegarder
          </button>
        </div>
      </div>
    </form>
    } @if(vm.isLoading) { Chargement... } @if(vm.hasError) { Erreur:
    {{ vm.error }}
    } }
  `,
})
export default class EditArticlePageComponent {
  public articleId = input<number | undefined>(undefined);

  private readonly articleStore = inject(ArticleStore);
  private readonly accountAuthStore = inject(AccountAuthStore);

  constructor() {
    effect(() => {
      const articleId = this.articleId();
      if (typeof articleId === 'number') {
        this.articleStore.loadArticle$(articleId);
        return;
      }
      this.articleStore.setArticleCreation();
    });
  }

  // todo add a loading state and error handling
  // todo disable submit the same

  protected readonly $vm = toSignal(
    this.articleStore.vm$.pipe(
      map((vm) => {
        const form = vm.result
          ? new FormGroup({
              title: new FormControl(
                vm.result?.article.title ?? '',
                Validators.required
              ),
              content: new FormControl('', Validators.required),
            })
          : null;

        return {
          ...vm,
          form,
        } as const;
      })
    )
  );

  onEdit() {
    const vm = this.$vm();
    if (!vm || !vm?.isLoaded) {
      return;
    }
    const articleForm = vm?.isLoaded ? vm.form : null;
    const account = this.accountAuthStore.authenticatedUser();
    if (!articleForm || articleForm.invalid || !account) {
      return;
    }
    const currentArticleData = vm.result;

    if (currentArticleData.isArticleCreation) {
      const articleCreation = ArticleCreationSchema.safeParse({
        ...articleForm.value,
        authorAccountId: account.id,
      });

      if (!articleCreation.success) {
        console.error(articleCreation.error.errors);
        return;
      }
      this.articleStore.saveEditedArticle$({
        isArticleCreation: true,
        article: articleCreation.data,
      });
    }

    if (!currentArticleData.isArticleCreation) {
      const articleEdit = ArticleEditSchema.safeParse({
        ...articleForm.value,
        authorAccountId: account.id,
      });

      if (!articleEdit.success) {
        console.error(articleEdit.error.errors);
        return;
      }
      this.articleStore.saveEditedArticle$({
        isArticleCreation: false,
        article: articleEdit.data,
      });
    }
  }
}
