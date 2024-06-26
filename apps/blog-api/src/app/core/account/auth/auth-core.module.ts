import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthJwtGuard } from './auth-jwt.guard';
import { AuthCoreService } from './auth-core.service';
import { AuthRoleValidatorService } from './auth-role-validator.service';
import { AuthRolesRestrictedAccessInterceptor } from './auth-roles-restricted-access.interceptor';

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
    AuthRoleValidatorService,
    AuthRolesRestrictedAccessInterceptor,
  ],
  exports: [
    JwtModule,
    AuthCoreService,
    AuthRolesRestrictedAccessInterceptor,
    AuthRoleValidatorService,
  ],
})
export class AuthCoreModule {}
