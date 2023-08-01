import {
  IsNumber,
  IsEnum,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schema/meal.schema';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

export class UpdateMealDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price: number;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(Category, { message: 'Either Soups, Salads, Sandwiches or Pasta' })
  category: Category;

  @IsEmpty({
    message: 'You dont have to provide your id , we know who you are',
  })
  user: User;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsMongoId({ message: 'Invalid Restaurant id' })
  restaurant: Restaurant;
}
