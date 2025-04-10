import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeCustomerDto } from '../dtos/create-stripe-customer.dto';
import { StripeCustomer } from '../stripe-customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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

  public async create(
    createStripeCustomerDto: CreateStripeCustomerDto,
    entityManager?: EntityManager,
  ) {
    let stripeCustomer;

    // Check if stripe customer exists first
    const stripeCustomerList = await this.stripe.customers.list({
      email: createStripeCustomerDto.email,
    });

    if (stripeCustomerList.data.length > 0) {
      stripeCustomer = stripeCustomerList.data[0];
    } else {
      // If not, create a new stripe customer
      stripeCustomer = await this.stripe.customers.create({
        name: createStripeCustomerDto.name,
        email: createStripeCustomerDto.email,
      });
    }

    // Save new stripe customer to DB
    const newStripeCustomer = entityManager.create(StripeCustomer, {
      customerId: stripeCustomer.id,
      metadata: stripeCustomer.metadata,
    });

    try {
      return entityManager.save(newStripeCustomer);
    } catch (error) {
      throw error;
    }
  }
}
