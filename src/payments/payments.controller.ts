import { Body, Controller, Post } from '@nestjs/common';
import { PaymentIntentsDto } from './dtos/payment-intents-dto';
import { PaymentIntentsService } from './providers/payment-intents.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    // Inject paymentIntentsService
    private readonly paymentIntentsService: PaymentIntentsService,
  ) {}

  @Post('intent')
  createPaymentIntent(@Body() paymentIntentsDto: PaymentIntentsDto) {
    return this.paymentIntentsService.createPaymentIntent(paymentIntentsDto);
  }

  // @Post('webhook')
  // handleWebhookEvent(@Req() req, @Res() res) {
  //   return this.paymentIntentsService.handleWebhookEvent(req, res);
  // }
}
