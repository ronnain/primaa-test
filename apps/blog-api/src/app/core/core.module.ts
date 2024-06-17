// src/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { DBModule } from './db/db.module';
import { AuthCoreModule } from './account/auth/auth-core.module';
import { PasswordModule } from './account/password/password.module';

@Global()
@Module({
  imports: [DBModule, AuthCoreModule, PasswordModule],
  exports: [DBModule, AuthCoreModule, PasswordModule],
})
export class CoreModule {}
