import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentMethodsService } from './providers/payment-methods.service';
import { HandleWebhookEventProvider } from './providers/handle-webhook-event.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CustomersModule } from 'src/customers/customers.module';
import { PaymentIntentsService } from './providers/payment-intents.service';
import { PaymentIntent } from './entities/payment-intent.entity';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentMethodsService,
    PaymentIntentsService,
    HandleWebhookEventProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([PaymentMethod, PaymentIntent]),
    CustomersModule,
  ],
  exports: [PaymentMethodsService, PaymentIntentsService],
})
export class PaymentsModule {}
