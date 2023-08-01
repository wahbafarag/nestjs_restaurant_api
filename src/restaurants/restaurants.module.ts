import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { restaurantSchema } from './schemas/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantRepository } from './restaurant.repository';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: restaurantSchema },
    ]),
  ],
  providers: [RestaurantsService, RestaurantRepository],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
