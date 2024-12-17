import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

export class PaymentDto {
  amount: number;
  currency: string;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  public createPaymentIntent({ amount, currency }: PaymentDto) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      //metadata: {userId},
      setup_future_usage: 'off_session',
      payment_method_types: ['card'],
    });
  }

  constructWebhookEvent(rawBody: Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(rawBody, sig, secret);
  }
}
