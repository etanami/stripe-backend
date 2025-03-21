import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentIntentsDto } from '../dtos/payment-intents-dto';
import { HandleWebhookEventProvider } from './handle-webhook-event.provider.';
import { CustomersService } from 'src/customers/providers/customers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from '../payment-method.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
  constructor(
    // Inject Stripe
    @Inject('Stripe')
    private readonly stripe: Stripe,

    // Inject handleWebhookEventProvider
    private readonly handleWebhookEventProvider: HandleWebhookEventProvider,

    // Injecting customersService
    private readonly customersService: CustomersService,

    // Inject paymentMethod repository
    @InjectRepository(PaymentMethod)
    private readonly paymentMethod: Repository<PaymentMethod>,
  ) {}

  public async createPayment(paymentIntentsDto: PaymentIntentsDto) {
    try {
      // Create a new Stripe customer and get the Id
      const customerData = {
        firstName: paymentIntentsDto.user.firstName,
        lastName: paymentIntentsDto.user.lastName,
        email: paymentIntentsDto.user.email,
        userId: paymentIntentsDto.user.id,
      };

      const { stripeCustomerId } =
        await this.customersService.create(customerData);

      // Create and store the payment method in the DB
      const paymentMethod = this.paymentMethod.create({
        stripePaymentMethodId: paymentIntentsDto.stripePaymentMethodId,
        user: paymentIntentsDto.user,
      });

      await this.paymentMethod.save(paymentMethod);

      // Create payment intent
      const paymentIntent = await this.createNewPaymentIntent(
        paymentIntentsDto,
        stripeCustomerId,
      );

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Create a payment intent attached to a customer
   */
  private async createNewPaymentIntent(
    paymentIntentsDto: PaymentIntentsDto,
    stripeCustomerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      //metadata: {userId},
      //setup_future_usage: 'off_session',
      payment_method: paymentIntentsDto.stripePaymentMethodId,
      currency: 'usd',
      customer: stripeCustomerId,
      amount: paymentIntentsDto.amount,
    });
  }

  public handleWebhookEvent(req, res) {
    return this.handleWebhookEventProvider.handleWebhookEvent(req, res);
  }
}
