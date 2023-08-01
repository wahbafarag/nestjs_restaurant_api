import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { RatingRepository } from './rating.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ratingSchema } from './schemas/rating.schema';
import {
  Restaurant,
  restaurantSchema,
} from '../restaurants/schemas/restaurant.schema';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ratingSchema }]),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: restaurantSchema },
    ]),
    RestaurantsModule,
  ],
  providers: [RatingsService, RatingRepository],
  controllers: [RatingsController],
})
export class RatingsModule {}
