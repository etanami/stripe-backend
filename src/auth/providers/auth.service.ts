import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';

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
    // Validate the user and get the user object
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // Return access token
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Generate access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      issuer: this.jwtConfiguration.issuer,
      audience: this.jwtConfiguration.audience,
      expiresIn: this.jwtConfiguration.accessTokenTTL,
    });

    return { access_token: accessToken };
  }

  public async validateUser(signInDto: SignInDto): Promise<User> {
    // Find the user by email
    const user: User = await this.usersService.findOneByEmail(signInDto.email);

    let isMatch: boolean = false;

    try {
      isMatch = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }

    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }
}
