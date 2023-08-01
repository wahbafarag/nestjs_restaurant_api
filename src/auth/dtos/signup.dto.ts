import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(18, { message: 'Users must be older than 18 ' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Email should not be empty' })
  @MinLength(4)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(40)
  password: string;
}
