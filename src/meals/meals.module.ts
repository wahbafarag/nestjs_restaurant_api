import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal } from './schema/meal.schema';
import { mealSchema } from './schema/meal.schema';
import { MealRepository } from './meal.repository';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { AuthModule } from '../auth/auth.module';
import {
  Restaurant,
  restaurantSchema,
} from '../restaurants/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: mealSchema }]),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: restaurantSchema },
    ]),
    RestaurantsModule,
    AuthModule,
  ],
  controllers: [MealsController],
  providers: [MealsService, MealRepository],
})
export class MealsModule {}
