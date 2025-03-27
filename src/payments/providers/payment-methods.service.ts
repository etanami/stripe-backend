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

      let stripeCustomer;

      // Check for existing payment method first
      const paymentMethodId = paymentIntentsDto.stripePaymentMethodId;

      let existingPaymentMethod = await this.paymentMethod.findOne({
        where: {
          stripePaymentMethodId: paymentMethodId,
        },
      });

      if (!existingPaymentMethod) {
        // Create a new customer to attach to the payment method
        stripeCustomer = await this.customersService.create(customerData);

        // Create a new payment method entry in the DB
        const newPaymentMethod = this.paymentMethod.create({
          stripePaymentMethodId: paymentMethodId,
          user: { id: paymentIntentsDto.user.id },
        });

        try {
          await this.paymentMethod.save(newPaymentMethod);
          existingPaymentMethod = newPaymentMethod;
        } catch (error) {
          throw error;
        }
      }

      // Create payment intent
      const paymentIntent = await this.createNewPaymentIntent(
        paymentIntentsDto,
        existingPaymentMethod.stripePaymentMethodId,
        stripeCustomer.stripeCustomerId,
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
    paymentMethodId: string,
    stripeCustomerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      //metadata: {userId},
      //setup_future_usage: 'off_session',
      payment_method: paymentMethodId,
      currency: 'usd',
      customer: stripeCustomerId,
      amount: paymentIntentsDto.amount,
    });
  }

  public handleWebhookEvent(req, res) {
    return this.handleWebhookEventProvider.handleWebhookEvent(req, res);
  }
}
