import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountStoreService } from './account-store.service';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountStoreService],
})
export class AccountModule {}
