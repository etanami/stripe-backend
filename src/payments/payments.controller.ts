import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentDto, PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() paymentDto: PaymentDto) {
    try {
      const paymentIntent =
        await this.paymentsService.createPaymentIntent(paymentDto);

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('webhook')
  async handleWebhookEvent(@Req() req, @Res() res) {
    const { rawBody } = req;
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = this.paymentsService.constructWebhookEvent(
        rawBody,
        sig,
        webhookSecret,
      );

      if (event.type === 'payment_intent.succeeded') {
        console.log('Payment succeeded: ', event.data.object);
      }

      res.status(200).send('Received webhook');
    } catch (err) {
      res.status(400).send(`Error receiving webhook: ${err.message}`);
    }
  }
}
