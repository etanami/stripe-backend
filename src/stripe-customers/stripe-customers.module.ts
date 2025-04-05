import { Module } from '@nestjs/common';
import { StripeCustomersController } from './stripe-customers.controller';
import { StripeCustomersService } from './providers/stripe-customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeCustomer } from './stripe-customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StripeCustomer])],
  controllers: [StripeCustomersController],
  providers: [StripeCustomersService],
  exports: [StripeCustomersService],
})
export class StripeCustomersModule {}
