import { Controller, UseInterceptors } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RootContract } from '@primaa/blog-api-contract';
import { ArticlesService } from './articles.service';
import { AuthAccount } from '../../core/account/auth/auth-account.decorator';
import { SafeAccount } from '@primaa/blog-types';
import { AfterHandlerGuard } from './test';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @TsRestHandler(RootContract.articles)
  @UseInterceptors(AfterHandlerGuard)
  async handler(@AuthAccount() account: SafeAccount) {
    return tsRestHandler(RootContract.articles, {
      createArticle: async ({ body }) => {
        const article = await this.articlesService.createArticle(
          body,
          account.id
        );
        return {
          status: 201,
          body: article,
        } as const;
      },
      getArticle: async ({ params }) => {
        try {
          const article = await this.articlesService.getArticle(
            parseInt(params.articleId)
          );
          return {
            status: 200,
            body: article,
          };
        } catch (error) {
          return {
            status: 404,
            body: null,
          };
        }
      },
      saveArticle: async ({ params, body }) => {
        try {
          const article = await this.articlesService.saveArticle(
            parseInt(params.articleId),
            body
          );
          return {
            status: 200,
            body: article,
          };
        } catch (error) {
          return {
            status: 404,
            body: null,
          };
        }
      },
      getArticles: async ({ query }) => {
        const articles = await this.articlesService.getArticles(query);
        return {
          status: 200,
          body: articles,
        };
      },
    });
  }
}
