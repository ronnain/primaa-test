import { Controller } from "@nestjs/common";
import { AccountStoreService } from "./account-store.service";

@Controller()
export class AccountController {

  constructor(private readonly accountStoreService: AccountStoreService) {}
}