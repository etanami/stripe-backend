import { Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersService } from 'src/customers/providers/customers.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { PaymentIntentsDto } from '../dtos/payment-intents-dto';
import { HandleWebhookEventProvider } from './handle-webhook-event.provider';
import { PaymentIntent } from '../entities/payment-intent.entity';
import { PaymentMethodsService } from './payment-methods.service';

export class PaymentIntentsService {
  constructor(
    // Inject Stripe
    @Inject('Stripe')
    private readonly stripe: Stripe,

    // Inject paymentMethod repository
    @InjectRepository(PaymentIntent)
    private readonly paymentIntentRepository: Repository<PaymentIntent>,

    // Inject handleWebhookEventProvider
    private readonly handleWebhookEventProvider: HandleWebhookEventProvider,

    // Injecting customersService
    private readonly customersService: CustomersService,

    // Injecting paymentMethodsService
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  public async createPaymentIntent(paymentIntentsDto: PaymentIntentsDto) {
    try {
      // Get or create payment method
      const paymentMethod =
        await this.paymentMethodsService.createPaymentMethod({
          userId: paymentIntentsDto.user.id,
          stripePaymentMethodId: paymentIntentsDto.stripePaymentMethodId,
        });

      // Create a new Stripe customer and get the Id
      const customer = await this.customersService.create({
        name: paymentIntentsDto.user.name,
        email: paymentIntentsDto.user.email,
        userId: paymentIntentsDto.user.id,
        phone: paymentIntentsDto.user.phone,
      });

      // Create stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: paymentIntentsDto.amount,
        currency: 'usd',
        payment_method: paymentMethod.stripePaymentMethodId,
        customer: customer.stripeCustomer.customerId,
        setup_future_usage: 'off_session', // Attaches payment method to customer for future payments
        //metadata: {userId},
      });
      //console.log(paymentIntent);

      // Create a new payment intent entry in the DB
      const newPaymentIntent = this.paymentIntentRepository.create({
        amount: paymentIntentsDto.amount,
        stripePaymentIntentId: paymentIntent.id,
        user: { id: paymentIntentsDto.user.id },
      });

      try {
        await this.paymentIntentRepository.save(newPaymentIntent);
      } catch (error) {
        console.error('Error ocurred', error);
        throw error;
      }

      // Attach payment method to the payment intent
      await this.stripe.paymentIntents.update(paymentIntent.id, {
        payment_method: paymentMethod.stripePaymentMethodId,
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('Error ocurred', error);
      throw new BadRequestException(error.message);
    }
  }
}
