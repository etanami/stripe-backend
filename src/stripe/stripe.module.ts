import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Global()
@Module({
  providers: [
    {
      provide: 'Stripe',
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get('STRIPE_SECRET_KEY'));
      },
      inject: [ConfigService],
    },
  ],
  exports: ['Stripe'],
})
export class StripeModule {}
