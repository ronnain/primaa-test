import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import { ArticleCreation, ArticleEdit, Pagination } from '@primaa/blog-types';

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
      include: {
        comments: {
          orderBy: {
            id: 'desc',
          },
          include: {
            account: {
              select: {
                email: true,
              },
            },
          },
        },
        account: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  public saveArticle(articleId: number, data: ArticleEdit) {
    return this.prismaService.article.update({
      where: {
        id: articleId,
        authorAccountId: data.authorAccountId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  public async getArticles(query: Pagination) {
    const articles = await this.prismaService.article.findMany({
      take: query.take,
      skip: query.skip,
      orderBy: query.orderBy,
    });
    const hasMore = articles.length === query.take;
    return {
      articles,
      hasMore,
    };
  }
}
