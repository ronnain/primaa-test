import { z } from "zod";

export const RoleSchema = z.enum(["ADMIN", "USER"]);

export const PasswordSchema = z.string().min(4, "Password must be at least 4 characters long");

export const AccountSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    password: PasswordSchema,
    role: RoleSchema,
});

export const SafeAccountSchema = AccountSchema
    .omit({ password: true })
    .describe("Safe client account without password field");

export const CreateAccountSchema = AccountSchema.pick({ email: true, password: true, role: true });

export type CreateAccount = z.infer<typeof CreateAccountSchema>;