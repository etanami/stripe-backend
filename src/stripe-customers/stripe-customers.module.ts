import { Module } from '@nestjs/common';
import { StripeCustomersController } from './stripe-customers.controller';
import { StripeCustomersService } from './providers/stripe-customers.service';

@Module({
  controllers: [StripeCustomersController],
  providers: [StripeCustomersService],
})
export class StripeCustomersModule {}
