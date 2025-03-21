import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  userId: number;
}
