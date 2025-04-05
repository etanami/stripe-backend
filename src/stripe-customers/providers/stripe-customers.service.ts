import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeCustomerDto } from '../dtos/create-stripe-customer.dto';
import { StripeCustomer } from '../stripe-customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StripeCustomersService {
  constructor(
    // Injecting stripe
    @Inject('Stripe')
    private readonly stripe: Stripe,

    // Injecting customersRepository
    @InjectRepository(StripeCustomer)
    private readonly stripeCustomersRepository: Repository<StripeCustomer>,
  ) {}

  public async create(createStripeCustomerDto: CreateStripeCustomerDto) {
    // Create a stripe customer
    const stripeCustomer = await this.stripe.customers.create({
      name: createStripeCustomerDto.name,
      email: createStripeCustomerDto.email,
    });

    // Save new stripe customer to DB
    const newStripeCustomer = this.stripeCustomersRepository.create({
      customerId: stripeCustomer.id,
      metadata: stripeCustomer.metadata,
    });

    try {
      return this.stripeCustomersRepository.save(newStripeCustomer);
    } catch (error) {
      throw error;
    }
  }
}
