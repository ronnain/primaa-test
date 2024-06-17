// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET_KEY}`,
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class AuthCoreModule {}
