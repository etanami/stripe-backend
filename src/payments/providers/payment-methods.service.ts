import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentMethodsDto } from '../dtos/payment-methods-dto';
import { HandleWebhookEventProvider } from './handle-webhook-event.provider.';

@Injectable()
export class PaymentMethodsService {
  constructor(
    // Inject Stripe
    @Inject('Stripe')
    private readonly stripe: Stripe,

    private configService: ConfigService,

    // Inject handleWebhookEventProvider
    private readonly handleWebhookEventProvider: HandleWebhookEventProvider,
  ) {}

  async createPayment(paymentDto: PaymentMethodsDto) {
    try {
      const paymentIntent = await this.createNewPaymentIntent(paymentDto);

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private createNewPaymentIntent(paymentDto: PaymentMethodsDto) {
    return this.stripe.paymentIntents.create({
      ...paymentDto,
      //metadata: {userId},
      setup_future_usage: 'off_session',
      payment_method_types: ['card'],
    });
  }

  public handleWebhookEvent(req, res) {
    return this.handleWebhookEventProvider.handleWebhookEvent(req, res);
  }
}
