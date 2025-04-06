import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from '../entities/payment-method.entity';
import { Repository } from 'typeorm';
import { PaymentMethodsDto } from '../dtos/payment-methods-dto copy';

@Injectable()
export class PaymentMethodsService {
  constructor(
    // Inject paymentMethod repository
    @InjectRepository(PaymentMethod)
    private readonly paymentMethod: Repository<PaymentMethod>,
  ) {}

  public async createPaymentMethod(paymentMethodsDto: PaymentMethodsDto) {
    // Check for existing payment method first
    const existingPaymentMethod = await this.paymentMethod.findOne({
      where: {
        stripePaymentMethodId: paymentMethodsDto.stripePaymentMethodId,
      },
      relations: ['user'],
    });

    // Return payment method if found
    if (existingPaymentMethod) {
      return existingPaymentMethod;
    }

    // If not, create a new payment method entry in the DB
    const newPaymentMethod = this.paymentMethod.create({
      stripePaymentMethodId: paymentMethodsDto.stripePaymentMethodId,
      user: { id: paymentMethodsDto.userId },
    });

    try {
      return await this.paymentMethod.save(newPaymentMethod);
    } catch (error) {
      console.error('Error ocurred', error);
      throw error;
    }
  }
}
