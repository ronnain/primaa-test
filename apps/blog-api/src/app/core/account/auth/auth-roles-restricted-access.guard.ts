import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRoleValidatorService } from './auth-role-validator.service';

@Injectable()
export class AuthRolesRestrictedAccessGuard {
  constructor(private authRoleValidatorService: AuthRoleValidatorService) {}

  canActivate(context: ExecutionContext) {
    console.log('canActivate context', context);
    return true;
  }
}
