import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class EditCommentComponent {
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
        id: currentArticleData.article.id,
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
