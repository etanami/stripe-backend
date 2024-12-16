import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

export class PaymentDto {
  amount: number;
  currency: string;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
