import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant, restaurantSchema } from './schemas/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantRepository } from './restaurant.repository';
import { ratingSchema, Review } from '../ratings/schemas/rating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: restaurantSchema },
    ]),
    MongooseModule.forFeature([{ name: Review.name, schema: ratingSchema }]),
  ],
  providers: [RestaurantsService, RestaurantRepository],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
