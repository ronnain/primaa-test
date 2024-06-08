import { Module } from "@nestjs/common";
import { DBModule } from "../../core/db/db.module";
import { PasswordModule } from "../../core/account/password/password.module";
import { AccountController } from "./account.controller";
import { AccountStoreService } from "./account-store.service";

@Module({
    imports: [DBModule, PasswordModule],
    controllers: [AccountController],
    providers: [AccountStoreService],
  })
  export class AccountModule {}
