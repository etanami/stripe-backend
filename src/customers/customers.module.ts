import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './providers/customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [TypeOrmModule.forFeature([Customer]), UsersModule],
  exports: [CustomersService, TypeOrmModule.forFeature([Customer])],
})
export class CustomersModule {}
