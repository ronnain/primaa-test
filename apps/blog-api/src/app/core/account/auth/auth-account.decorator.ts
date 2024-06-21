import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SafeAccountPayload } from './auth-core.service';

export const AuthAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: SafeAccountPayload = ctx.switchToHttp().getRequest();
    return request.user.safeAccount;
  }
);
