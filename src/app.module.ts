import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MealsModule } from './meals/meals.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({

  imports: [
    MongooseModule.forRoot(process.env.MONGO),
    UsersModule,
    AuthModule,
    RestaurantsModule,
    MealsModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
