import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './providers/payments.service';
import { HandleWebhookEventProvider } from './providers/handle-webhook-event.provider.';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, HandleWebhookEventProvider],
})
export class PaymentsModule {}
