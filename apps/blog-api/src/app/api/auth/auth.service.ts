import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import { CreateAccount, SafeAccountSchema } from '@primaa/blog-types';
import { PasswordService } from '../../core/account/password/password.service';
import { AuthCoreService } from '../../core/account/auth/auth-core.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private passwordService: PasswordService,
    private authCoreService: AuthCoreService
  ) {}

  public async createAccount({ email, password, role }: CreateAccount) {
    const account = await this.prismaService.account.create({
      data: {
        email,
        password: this.passwordService.hash(password),
        role,
      },
    });
    const safeAccount = SafeAccountSchema.parse(account);
    const token = this.authCoreService.getJwtToken(account.id);
    return {
      account: safeAccount,
      token,
    };
  }

  public async login({ email, password }: { email: string; password: string }) {
    const account = await this.prismaService.account.findFirstOrThrow({
      where: {
        email,
      },
    });
    const isValidPassword = this.passwordService.compare(
      password,
      account.password
    );
    if (!isValidPassword) {
      console.log('isValidPassword', isValidPassword, 'throw');
      throw new Error('Invalid email or password');
    }
    console.log('sign');
    try {
      const safeAccount = SafeAccountSchema.parse(account);
      const token = this.authCoreService.getJwtToken(account.id);
      console.log('token', token);
      return {
        account: safeAccount,
        token,
      };
    } catch (error) {
      console.error('error', error);
      throw new Error('Unknown error');
    }
  }
}
