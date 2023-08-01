import {
  IsString,
  IsOptional,
  IsEmpty,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment: string;

  @IsNotEmpty()
  @Min(0, { message: 'Rating should me from 0 to 5' })
  @Max(5, { message: 'Rating should me from 0 to 5' })
  rating: number;

  @IsEmpty({ message: 'You dont have to share your credentials ,we know you' })
  user: User;

  @IsString()
  @IsNotEmpty()
  restaurant: Restaurant;
}
