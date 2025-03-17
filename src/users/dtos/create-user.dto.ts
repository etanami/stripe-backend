import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  /** User's first name */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  /** User's last name (optional) */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  lastName?: string;

  /** User's email address */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  /** User's password, minimum 8 characters */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  password: string;
}
