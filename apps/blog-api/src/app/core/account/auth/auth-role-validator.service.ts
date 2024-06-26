import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { ValidateResourceOwnerForRoutes } from './ts-rest-auth-util';
import { SafeAccount } from '@primaa/blog-types';

// Get inputs of controller

@Injectable()
export class AuthRoleValidatorService
  implements ValidateResourceOwnerForRoutes
{
  constructor(private prismaService: PrismaService) {}

  public validateOwner(
    requestor: SafeAccount
  ): ReturnType<ValidateResourceOwnerForRoutes['validateOwner']> {
    return {
      account: {},
      articles: {
        saveArticle: async ({ body }) => {
          try {
            await this.prismaService.article.findUniqueOrThrow({
              where: {
                id: body.id,
                authorAccountId: requestor.id,
              },
            });
            return true;
          } catch (error) {
            return false;
          }
        },
      },
      auth: {},
      comments: {},
    };
  }
}
