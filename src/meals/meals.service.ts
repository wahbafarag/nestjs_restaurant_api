import { Injectable } from '@nestjs/common';
import { Meal } from './schema/meal.schema';
import { CreateMealDto } from './dtos/create-meal.dto';
import { User } from '../users/schemas/user.schema';
import { MealRepository } from './meal.repository';
import { UpdateMealDto } from './dtos/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(private mealRepo: MealRepository) {}

  async create(meal: CreateMealDto, user: User): Promise<Meal> {
    return await this.mealRepo.create(meal, user);
  }

  async update(id: string, meal: UpdateMealDto): Promise<Meal> {
    return await this.mealRepo.update(id, meal);
  }

  async findAll(query: any): Promise<Meal[]> {
    return await this.mealRepo.findAll(query);
  }

  async findById(id: string): Promise<Meal> {
    return await this.mealRepo.findById(id);
  }

  async allMealsAtRestaurant(resId: string): Promise<Meal[]> {
    return await this.mealRepo.allMealsAtRestaurant(resId);
  }

  async delete(id: string): Promise<void> {
    return await this.mealRepo.delete(id);
  }
}
