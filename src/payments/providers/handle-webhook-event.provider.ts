import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { PaymentIntent } from '../entities/payment-intent.entity';
import { paymentStatus } from 'src/transactions/enums/payment-status.enum';

@Injectable()
export class HandleWebhookEventProvider {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(PaymentIntent)
    private paymentIntentRepository: Repository<PaymentIntent>,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  public async handleWebhookEvent(req, res) {
    const { rawBody } = req;
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = this.constructWebhookEvent(rawBody, sig, webhookSecret);

      // Handle different payment intent events
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentIntentCanceled(event.data.object);
          break;
        case 'payment_intent.processing':
          await this.handlePaymentIntentProcessing(event.data.object);
          break;
      }

      res.status(200).send('Received webhook');
    } catch (err) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Error receiving webhook: ${err.message}`);
    }
  }

  private constructWebhookEvent(rawBody: Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(rawBody, sig, secret);
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    console.log('Payment succeeded:', paymentIntent.id);

    // Update payment intent status in database
    await this.updatePaymentIntentStatus(paymentIntent.id, 'successful');

    // business logic here (e.g., fulfill order, send confirmation email)
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment failed:', paymentIntent.id);
    console.log('Failure reason:', paymentIntent.last_payment_error?.message);

    // Update payment intent status in database
    await this.updatePaymentIntentStatus(paymentIntent.id, 'failed');

    //business logic here (e.g., notify user, attempt recovery)
  }

  private async handlePaymentIntentCanceled(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    console.log('Payment canceled:', paymentIntent.id);

    // Update payment intent status in database
    await this.updatePaymentIntentStatus(paymentIntent.id, 'canceled');

    // business logic here
  }

  private async handlePaymentIntentProcessing(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    console.log('Payment processing:', paymentIntent.id);

    // Update payment intent status in database
    await this.updatePaymentIntentStatus(paymentIntent.id, 'processing');

    // business logic here
  }

  private async updatePaymentIntentStatus(
    stripePaymentIntentId: string,
    status: string,
  ) {
    try {
      // Find the payment intent in your database
      const paymentIntent = await this.paymentIntentRepository.findOne({
        where: { stripePaymentIntentId },
      });

      if (paymentIntent) {
        // Update the status
        paymentIntent.status = status as paymentStatus;
        await this.paymentIntentRepository.save(paymentIntent);
        console.log(
          `Updated payment intent ${stripePaymentIntentId} status to ${status}`,
        );
      } else {
        console.warn(
          `Payment intent ${stripePaymentIntentId} not found in database`,
        );
      }
    } catch (error) {
      console.error(`Error updating payment intent status: ${error.message}`);
    }
  }
}
