import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    // Injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // Inject hashingProvider
    private readonly hashingProvider: HashingProvider,
  ) {}

  /**
   * Register a new user
   */
  public async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('The user already exists');
    }

    // Create a new user
    const hashedPassword = await this.hashingProvider.hashingPassword(
      createUserDto.password,
    );

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      console.error('Error ocurred', error);
      throw error;
    }

    return newUser;
  }

  /**
   * Find a user by Id
   */
  public async findOneById(id: number) {
    // Find user in the DB
    const user = await this.usersRepository.findOneBy({ id });

    // Handle exception
    if (!user) {
      throw new NotFoundException('User ID does not exist');
    }

    return user;
  }

  public async findOneByEmail(email: string) {
    // Find user in the DB
    let user;

    try {
      user = await this.usersRepository.findOneBy({ email });
    } catch (error) {
      throw error;
    }

    // Handle exception
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
