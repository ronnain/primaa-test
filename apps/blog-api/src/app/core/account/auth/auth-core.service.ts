import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../db/prisma.service';
import { SafeAccount, SafeAccountSchema } from '@primaa/blog-types';

export type JwtAuthAccount = {
  accountId: number;
};

export type SafeAccountPayload = {
  user: {
    safeAccount: SafeAccount;
  };
};

@Injectable()
export class AuthCoreService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  public getJwtToken(accountId: number) {
    const token = this.jwtService.sign({
      accountId,
    } satisfies JwtAuthAccount);
    return token;
  }

  public async validate(payload: JwtAuthAccount) {
    try {
      const account = await this.prismaService.account.findUniqueOrThrow({
        where: {
          id: payload.accountId,
        },
      });
      const safeAccount = SafeAccountSchema.parse(account);
      return { safeAccount };
    } catch (error) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }
}
