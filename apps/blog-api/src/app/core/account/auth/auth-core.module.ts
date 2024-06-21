import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthJwtGuard } from './auth-jwt.guard';
import { AuthCoreService } from './auth-core.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET_KEY}`,
    }),
  ],
  providers: [
    AuthCoreService,
    AuthJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
  ],
  exports: [JwtModule, AuthCoreService],
})
export class AuthCoreModule {}
