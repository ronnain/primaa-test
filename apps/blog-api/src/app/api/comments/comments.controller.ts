import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RootContract } from '@primaa/blog-api-contract';
import { AuthAccount } from '../../core/account/auth/auth-account.decorator';
import { SafeAccount } from '@primaa/blog-types';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @TsRestHandler(RootContract.comments)
  async handler(@AuthAccount() account: SafeAccount) {
    return tsRestHandler(RootContract.comments, {
      createComment: async ({ params, body }) => {
        const comment = await this.commentsService.createComment(
          body,
          parseInt(params.articleId, 10),
          account.id
        );
        return {
          status: 201,
          body: comment,
        } as const;
      },
      saveComment: async ({ params, body }) => {
        try {
          const comment = await this.commentsService.saveComment(
            parseInt(params.commentId),
            body,
            parseInt(params.articleId, 10)
          );
          return {
            status: 200,
            body: comment,
          };
        } catch (error) {
          return {
            status: 404,
            body: null,
          };
        }
      },
    });
  }
}
