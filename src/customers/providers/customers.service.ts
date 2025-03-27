import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
      },
    });

    if (customer) {
      return customer;
    }

    // If not, create a new stripe customer
    const customerName = `${createCustomerDto.firstName} ${createCustomerDto.lastName}`;

    const stripeCustomer = await this.stripe.customers.create({
      email: createCustomerDto.email,
      name: customerName,
    });

    // Create a new customer and save to DB
    customer = this.customersRepository.create({
      user,
      stripeCustomerId: stripeCustomer?.id,
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
