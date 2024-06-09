import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/db/prisma.service";
import { CreateAccount, SafeAccountSchema } from "@primaa/blog-types";
import { PasswordService } from "../../core/account/password/password.service";

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService, private passwordService: PasswordService) {}

    public async createAccount({email, password, role}: CreateAccount) {
        const account = await this.prismaService.account.create({
            data: {
                email,
                password: this.passwordService.hash(password),
                role,
            }
        });
        return SafeAccountSchema.parse(account);
    }

    public async login({email, password}: {email: string, password: string}) {
        const account = await this.prismaService.account.findFirstOrThrow({
            where: {
                email,
            }
        });
        const isValidPassword = this.passwordService.compare(password, account.password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }
        return SafeAccountSchema.parse(account);
    }

}