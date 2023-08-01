import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal } from './schema/meal.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { CreateMealDto } from './dtos/create-meal.dto';
import { User } from '../users/schemas/user.schema';
import { UpdateMealDto } from './dtos/update-meal.dto';

@Injectable()
export class MealRepository {
  constructor(
    @InjectModel('Meal') private mealModel: Model<Meal>,
    @InjectModel('Restaurant') private restaurantModel: Model<Restaurant>,
  ) {}

  async create(meal: CreateMealDto, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant) throw new NotFoundException('Invalid Restaurant');

    if (restaurant.user.toString() !== user._id.toString())
      throw new ForbiddenException(
        'You can not add any meals to this restaurant',
      );

    const newMeal = await this.mealModel.create(data);
    if (!restaurant.meals) {
      restaurant.meals = [];
    }
    restaurant.meals.push(newMeal.id); // add this meal to restaurant menu

    await restaurant.save();
    return (await newMeal.populate('user', 'name email')).populate(
      'restaurant',
      'name',
    );
  }

  async update(id: string, meal: UpdateMealDto): Promise<Meal> {
    const newMeal = await this.mealModel.findByIdAndUpdate(id, meal, {
      new: true,
      runValidators: true,
    });
    return (await newMeal.populate('user', 'name email')).populate(
      'restaurant',
      'name',
    );
  }

  async findAll(query: any): Promise<Meal[]> {
    const resultsPerPage = 5;
    const page = Number(query.page) || 1;
    const skip = resultsPerPage * (page - 1);
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    return await this.mealModel
      .find()
      .skip(skip)
      .limit(resultsPerPage)
      .find(keyword)
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('restaurant', 'name');
  }

  async findById(id: string): Promise<Meal> {
    const meal = await this.mealModel.findById(id);
    if (!meal) throw new NotFoundException('Meal not found');
    return (await meal.populate('user', 'name email')).populate(
      'restaurant',
      'name',
    );
  }

  async delete(id: string): Promise<void> {
    return await this.mealModel.findByIdAndDelete(id);
  }

  async allMealsAtRestaurant(resId: string): Promise<Meal[]> {
    return await this.mealModel
      .find({ restaurant: resId })
      .populate('user ', 'name email')
      .populate('restaurant', 'name');
  }
}
