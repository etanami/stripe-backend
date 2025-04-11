import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    // Inject usersService
    private readonly usersService: UsersService,

    // Inject hashingProvider
    private readonly hashingProvider: HashingProvider,

    // Inject jwtService
    private readonly jwtService: JwtService,

    // Inject jwtConfig file
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find the user by email
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // Check if the user is authorized by comparing passwords
    let isAuthorized: boolean = false;

    try {
      isAuthorized = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }

    if (!isAuthorized) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Return access token
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      issuer: this.jwtConfiguration.issuer,
      audience: this.jwtConfiguration.audience,
      expiresIn: this.jwtConfiguration.accessTokenTTL,
    });

    return { access_token: accessToken };
  }
}
