import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import Stripe from 'stripe';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { StripeCustomersService } from 'src/stripe-customers/providers/stripe-customers.service';

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

    // Inject stripeCustomersService
    private readonly stripeCustomersService: StripeCustomersService,
  ) {}

  /**
   * Create a new Customer
   */
  public async create(createCustomerDto: CreateCustomerDto) {
    let customer;

    // Check if user exists
    const user = await this.usersService.findOneById(createCustomerDto.userId);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    // Check if customer exists
    customer = await this.customersRepository.findOne({
      where: { user: { id: createCustomerDto.userId } },
      relations: {
        user: true,
        stripeCustomer: true,
      },
    });

    if (customer) {
      return customer;
    }

    // If not, create a new stripe customer
    const stripeCustomer = await this.stripeCustomersService.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
    });

    // Create a new customer and save to DB
    customer = this.customersRepository.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      phone: createCustomerDto.phone,
      user,
      stripeCustomer,
    });

    try {
      customer = await this.customersRepository.save(customer);
    } catch (error) {
      console.error('Error ocurred', error);
      throw error;
    }

    return customer;
  }

  public async getCustomerById(user: User) {
    let customer = undefined;

    customer = await this.customersRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (!customer) {
      throw new BadRequestException('No customer found');
    }

    return customer;
  }
}
