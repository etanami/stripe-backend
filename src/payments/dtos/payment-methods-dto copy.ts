import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentMethodsDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  stripePaymentMethodId: string;
}
