import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RootContract } from "@primaa/blog-api-contract";

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @TsRestHandler(RootContract.auth)
  async handler() {
    return tsRestHandler(RootContract.auth, {
      createAccount: async ({ body }) => {
        try {
          const safeAccount = await this.authService.createAccount(body);
          return {
            status: 201,
            body: safeAccount,
          }
        } catch (error) {
          return {
            status: 409,
            body: {
              error: "Account already exists",
              message: "An account with this email address already exists.",
            },
          };
        }
      },
      login: async ({ body }) => {
        try {
          const safeAccount = await this.authService.login(body);
          return {
            status: 200,
            body: safeAccount,
          }
        } catch (error) {
          return {
            status: 404,
            body: {
              error: "Not found",
              message: "Invalid email or password",
            },
          };
        }
      }
    });
  }
}