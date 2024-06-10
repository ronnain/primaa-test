import { Module } from '@nestjs/common';
import { DBModule } from '../../core/db/db.module';
import { PasswordModule } from '../../core/account/password/password.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DBModule, PasswordModule, PasswordModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
