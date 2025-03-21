import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentMethodsService } from './providers/payment-methods.service';
import { PaymentIntentsDto } from './dtos/payment-intents-dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post('create-payment-intent')
  createPaymentIntent(@Body() paymentIntentsDto: PaymentIntentsDto) {
    return this.paymentMethodsService.createPayment(paymentIntentsDto);
  }

  @Post('webhook')
  handleWebhookEvent(@Req() req, @Res() res) {
    return this.paymentMethodsService.handleWebhookEvent(req, res);
  }
}
