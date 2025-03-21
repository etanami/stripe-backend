import { Module } from '@nestjs/common';
import { PaymentsController } from './payment-methods.controller';
import { PaymentMethodsService } from './providers/payment-methods.service';
import { HandleWebhookEventProvider } from './providers/handle-webhook-event.provider.';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './payment-method.entity';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentMethodsService, HandleWebhookEventProvider],
  imports: [TypeOrmModule.forFeature([PaymentMethod]), CustomersModule],
})
export class PaymentMethodsModule {}
