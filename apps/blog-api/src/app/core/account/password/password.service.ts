import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';


@Injectable()
export class PasswordService {
    public hash(password: string) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    public compare(plainTextPassword: string, hashedPassword: string): boolean {
        const hashedInput = this.hash(plainTextPassword);
        return hashedInput === hashedPassword;
    }
}