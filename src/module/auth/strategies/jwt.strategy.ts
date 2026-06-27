import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Status_ACTIVE_LOCKED } from '../../../common/enums/status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findOne(payload.sub);
      if (user.status === Status_ACTIVE_LOCKED.LOCKED) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị khóa.');
      }
      return { userId: payload.sub, email: payload.email, role: payload.role };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa.');
    }
  }
}
