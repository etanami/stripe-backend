import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';

export class PaymentIntentsDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  amount: number;

  @IsNotEmpty()
  user: User;

  @IsString()
  @IsNotEmpty()
  stripePaymentMethodId: string;
}
