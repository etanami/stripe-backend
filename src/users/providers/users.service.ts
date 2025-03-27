import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // Injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
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
      throw new BadRequestException('User ID does not exist');
    }

    return user;
  }
}
