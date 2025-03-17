import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentMethodsService } from './providers/payment-methods.service';
import { PaymentMethodsDto } from './dtos/payment-methods-dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post('create-payment-intent')
  createPaymentIntent(@Body() paymentDto: PaymentMethodsDto) {
    return this.paymentMethodsService.createPayment(paymentDto);
  }

  @Post('webhook')
  handleWebhookEvent(@Req() req, @Res() res) {
    return this.paymentMethodsService.handleWebhookEvent(req, res);
  }
}
