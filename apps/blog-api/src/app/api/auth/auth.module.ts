import { Module } from "@nestjs/common";
import { DBModule } from "../../core/db/db.module";
import { PasswordModule } from "../../core/account/password/password.module";
import { AuthController } from "./auth.controller";
import { AccountStoreService } from "../account/account-store.service";

@Module({
    imports: [DBModule, PasswordModule, PasswordModule],
    controllers: [AuthController],
    providers: [AccountStoreService],
  })
  export class AuthModule {}
