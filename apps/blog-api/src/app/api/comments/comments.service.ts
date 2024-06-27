import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import { CommentCreation, CommentEdit } from '@primaa/blog-types';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  public createComment(
    data: CommentCreation,
    articleId: number,
    authorAccountId: number
  ) {
    return this.prismaService.comment.create({
      data: {
        ...data,
        articleId,
        authorAccountId,
      },
    });
  }

  public saveComment(commentId: number, data: CommentEdit, articleId: number) {
    return this.prismaService.comment.update({
      where: {
        id: commentId,
        authorAccountId: data.authorAccountId,
      },
      data: {
        ...data,
        articleId,
        updatedAt: new Date(),
      },
    });
  }

  public async removeComment(commentId: number) {
    return this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
