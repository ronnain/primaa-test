import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import { ArticleCreation } from '@primaa/blog-types';

@Injectable()
export class ArticlesService {
  constructor(private prismaService: PrismaService) {}

  public createArticle(data: ArticleCreation, authorAccountId: number) {
    return this.prismaService.article.create({
      data: {
        ...data,
        authorAccountId,
      },
    });
  }

  public getArticle(articleId: number) {
    return this.prismaService.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });
  }

  public saveArticle(articleId: number, data: ArticleCreation) {
    return this.prismaService.article.update({
      where: {
        id: articleId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
