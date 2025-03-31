import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentMethodsModule } from './payments/payment-methods.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeCustomersModule } from './stripe-customers/stripe-customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        //entities: [User],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    PaymentMethodsModule,
    UsersModule,
    CustomersModule,
    TransactionsModule,
    StripeModule,
    StripeCustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
