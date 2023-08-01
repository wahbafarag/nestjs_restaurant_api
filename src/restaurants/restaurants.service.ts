import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { User } from '../users/schemas/user.schema';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private restaurantRepo: RestaurantRepository) {}

  async create(body: CreateRestaurantDto, user: User): Promise<Restaurant> {
    return await this.restaurantRepo.create(body, user);
  }

  async update(
    resId: string,
    body: UpdateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    return await this.restaurantRepo.update(resId, body, user);
  }

  async findAll(query: any): Promise<Restaurant[]> {
    return await this.restaurantRepo.findAll(query);
  }

  async findById(id: string): Promise<Restaurant> {
    return await this.restaurantRepo.findById(id);
  }

  async delete(id: string): Promise<void> {
    return await this.restaurantRepo.delete(id);
  }


  async findOne(id:any){
    return this.restaurantRepo.findOne(id)
  }

}
