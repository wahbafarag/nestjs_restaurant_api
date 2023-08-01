import {
  IsEmail,
  IsNotEmpty,
  IsString,
  
  MinLength,
  MaxLength,

} from 'class-validator';

export class LoginDto {
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
