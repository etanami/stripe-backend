//local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/user.entity';
import { AuthService } from '../providers/auth.service';
import { SignInDto } from '../dtos/sign-in.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(signInDto: SignInDto): Promise<User> {
    const user = await this.authService.validateUser(signInDto);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
