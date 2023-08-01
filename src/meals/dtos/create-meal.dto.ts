import {
  IsNumber,
  IsEnum,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsMongoId,
} from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schema/meal.schema';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Either Soups, Salads, Sandwiches or Pasta' })
  category: Category;

  @IsEmpty({
    message: 'You dont have to provide your id , we know who you are',
  })
  user: User;

  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Invalid Restaurant id' })
  restaurant: Restaurant;
}
