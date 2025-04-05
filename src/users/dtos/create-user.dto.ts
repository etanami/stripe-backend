import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  /** User's full name */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  /** User's email address */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  /** User's phone number, minimum 10 characters */
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(13)
  phone: string;

  /** User's password, minimum 8 characters */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  password: string;
}
