import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateCustomerDto {
  @IsNotEmpty()
  user: User;

  @IsString()
  @IsNotEmpty()
  stripeCustomerId: string;
}
