import {
  IS_STRONG_PASSWORD,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'|<>,.?/~`\\-]).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password: string;

  @IsNotEmpty()
  country : string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(12)
  mobile_number : string
}