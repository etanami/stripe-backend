import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStripeCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
