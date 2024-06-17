import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import { CreateAccount, SafeAccountSchema } from '@primaa/blog-types';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../core/account/password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService
  ) {}

  public async createAccount({ email, password, role }: CreateAccount) {
    const account = await this.prismaService.account.create({
      data: {
        email,
        password: this.passwordService.hash(password),
        role,
      },
    });
    const token = this.jwtService.sign({
      email: account.email,
      role: account.role,
    });
    return {
      account: SafeAccountSchema.parse(account),
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
      console.log('process.env.JWT_AUTH_SECRET', process.env.JWT_AUTH_SECRET);
      const token = this.jwtService.sign({
        email: account.email,
        role: account.role,
      });
      console.log('token', token);
      return {
        account: SafeAccountSchema.parse(account),
        token,
      };
    } catch (error) {
      console.error('error', error);
      throw new Error('Unknown error');
    }
  }
}
