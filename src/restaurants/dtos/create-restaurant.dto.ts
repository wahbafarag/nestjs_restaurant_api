import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid Email' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('EG')
  readonly phoneNo: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Category, {
    message: 'Invalid Category, Fast Food or Cafe or Fine Dinning',
  })
  readonly category: Category;

  @IsEmpty({ message: 'Your dont have to share your id, we know who you are' })
  readonly user: User;
}
