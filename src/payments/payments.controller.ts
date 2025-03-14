import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './providers/payments.service';
import { PaymentDto } from './dtos/payment-dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  createPaymentIntent(@Body() paymentDto: PaymentDto) {
    return this.paymentsService.createPayment(paymentDto);
  }

  @Post('webhook')
  handleWebhookEvent(@Req() req, @Res() res) {
    return this.paymentsService.handleWebhookEvent(req, res);
  }
}
