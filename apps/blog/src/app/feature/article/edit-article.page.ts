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
import { ArticleStore } from './article.store';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';

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
    CdkTextareaAutosize,
    TextFieldModule,
  ],
  providers: [ArticleStore],
  template: `
    <div class="mx-auto container p-4">
      <h1 class="text-2xl">Editer un article</h1>
    </div>
    @if ($vm(); as vm) { @if(vm.form) {
    <form *ngIf="vm.form" [formGroup]="vm.form">
      <div class="mx-auto container px-4">
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
              cdkTextareaAutosize
              cdkAutosizeMinRows="1"
              cdkAutosizeMaxRows="10"
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
    } }
  `,
})
export default class EditArticlePageComponent {
  public articleId = input(undefined, {
    transform: (value: string | undefined) =>
      value ? parseInt(value, 10) : undefined,
  });

  private readonly articleStore = inject(ArticleStore);
  private readonly accountAuthStore = inject(AccountAuthStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

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
              content: new FormControl(
                vm.result?.article.content ?? '',
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

      if (typeof articleId === 'number') {
        this.articleStore.loadArticle$(articleId);
        return;
      }
      this.articleStore.setArticleCreation();
    });

    effect(() => {
      // redirect to the edit page of the article once it is created
      const vm = this.$vm();
      if (
        vm &&
        vm.isLoaded &&
        !vm.result.isArticleCreation &&
        vm.result.article.id &&
        this.articleId() !== vm.result.article.id
      ) {
        this.router.navigate([vm.result.article.id], {
          relativeTo: this.activatedRoute,
        });
      }
    });
  }

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
      return;
    }

    if (!currentArticleData.isArticleCreation && currentArticleData) {
      const articleEdit = ArticleEditSchema.safeParse({
        ...articleForm.value,
        id: currentArticleData.article.id,
        authorAccountId: currentArticleData.article.authorAccountId,
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

  onRemove() {
    const articleId = this.articleId();
    if (!articleId) {
      return;
    }
    this.articleStore.removeArticle$(articleId).subscribe((data) => {
      if (data) {
        this.router.navigate(['/']);
      }
    });
  }
}
