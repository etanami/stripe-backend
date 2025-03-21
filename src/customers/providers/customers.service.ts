import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import Stripe from 'stripe';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    // Injecting stripe
    @Inject('Stripe')
    private readonly stripe: Stripe,

    // Injecting customersRepository
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,

    // Inject usersService
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new Customer
   */
  public async create(createCustomerDto: CreateCustomerDto) {
    // Check if customer exists
    let customer = undefined;

    const user = await this.usersService.findOneById(createCustomerDto.userId);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    try {
      customer = await this.customersRepository.findOne({
        where: { user },
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    // Throw error if customer already exists
    if (customer) {
      throw new BadRequestException('Stripe customer already exists');
    }

    // If not, create a new stripe customer
    const customerName = `${createCustomerDto.firstName} ${createCustomerDto.lastName}`;

    const stripeCustomer = await this.stripe.customers.create({
      email: createCustomerDto.email,
      name: customerName,
    });

    console.log(stripeCustomer);

    // Create a new customer and save to DB
    let newCustomer = this.customersRepository.create({
      user,
      stripeCustomerId: stripeCustomer.id,
    });

    try {
      newCustomer = await this.customersRepository.save(newCustomer);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return newCustomer;
  }

  public async getCustomerById(user: User) {
    let customer = undefined;

    try {
      customer = await this.customersRepository.findOne({
        where: {
          user: { id: user.id },
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    if (!customer) {
      throw new BadRequestException('No customer found');
    }
  }
}
