import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentMethodsDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
