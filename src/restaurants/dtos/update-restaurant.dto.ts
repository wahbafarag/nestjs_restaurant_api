import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from '../../users/schemas/user.schema';
export class UpdateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid Email' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber('EG')
  readonly phoneNo: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @IsEnum(Category, { message: 'Invalid Category' })
  readonly category: Category;

  @IsEmpty({ message: 'We know who you are , dont provide your ID' })
  readonly user: User;
}
