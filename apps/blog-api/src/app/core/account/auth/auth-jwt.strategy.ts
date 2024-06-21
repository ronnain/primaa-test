import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthCoreService, JwtAuthAccount } from './auth-core.service';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authCoreService: AuthCoreService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
    });
  }

  async validate(payload: JwtAuthAccount) {
    return this.authCoreService.validate(payload);
  }
}
