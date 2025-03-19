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

@Injectable()
export class CustomersService {
  constructor(
    // Injecting stripe
    @Inject('Stripe')
    private readonly stripe: Stripe,

    // Injecting customersRepository
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  /**
   * Create a new Customer
   */
  public async create(createCustomerDto: CreateCustomerDto) {
    // Check if customer exists
    let customer = undefined;

    try {
      customer = await this.customersRepository.findOne({
        where: createCustomerDto.user,
      });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    // Throw error if customer already exists
    if (customer) {
      throw new BadRequestException('Stripe customer already exists');
    }

    // If not, create a new stripe customer
    const customerName = `${createCustomerDto.user.firstName} ${createCustomerDto.user.lastName}`;

    const stripeCustomer = await this.stripe.customers.create({
      email: createCustomerDto.user.email,
      name: customerName,
    });

    console.log(stripeCustomer);

    // Create a new customer and save to DB
    let newCustomer = this.customersRepository.create({
      ...createCustomerDto.user,
      stripeCustomerId: stripeCustomer.id,
    });

    try {
      newCustomer = await this.customersRepository.save(newCustomer);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return newCustomer;
  }
}
