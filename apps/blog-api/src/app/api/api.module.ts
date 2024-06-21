import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [AuthModule, AccountModule, ArticlesModule],
})
export class ApiModule {}
