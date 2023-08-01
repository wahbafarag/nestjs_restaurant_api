import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @IsOptional()
  @MaxLength(20)
  name: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @Min(18, { message: 'Users must be older than 18 ' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Email should not be empty' })
  @MinLength(4)
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(40)
  @IsOptional()
  password: string;
}
