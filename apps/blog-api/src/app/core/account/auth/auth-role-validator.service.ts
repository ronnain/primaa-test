import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { ValidateResourceOwnerForRoutes } from './ts-rest-auth-util';

// Get inputs of controller

@Injectable()
export class AuthRoleValidatorService
  implements ValidateResourceOwnerForRoutes
{
  constructor(private prismaService: PrismaService) {}

  public validateOwner(): ReturnType<
    ValidateResourceOwnerForRoutes['validateOwner']
  > {
    return {
      account: {},
      articles: {
        saveArticle: async (data) => {
          return true;
        },
      },
      auth: {},
      comments: {},
    };
  }
}
