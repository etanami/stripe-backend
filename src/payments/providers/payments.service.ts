import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentDto } from '../dtos/payment-dto';
import { HandleWebhookEventProvider } from './handle-webhook-event.provider.';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,

    // Inject handleWebhookEventProvider
    private readonly handleWebhookEventProvider: HandleWebhookEventProvider,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  async createPayment(paymentDto: PaymentDto) {
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

  private createNewPaymentIntent(paymentDto: PaymentDto) {
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
