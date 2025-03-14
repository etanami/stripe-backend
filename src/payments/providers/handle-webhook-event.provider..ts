import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class HandleWebhookEventProvider {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  public handleWebhookEvent(req, res) {
    const { rawBody } = req;
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = this.constructWebhookEvent(rawBody, sig, webhookSecret);

      if (event.type === 'payment_intent.succeeded') {
        console.log('Payment succeeded: ', event.data.object);
      }

      res.status(200).send('Received webhook');
    } catch (err) {
      res.status(400).send(`Error receiving webhook: ${err.message}`);
    }
  }

  private constructWebhookEvent(rawBody: Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(rawBody, sig, secret);
  }
}
