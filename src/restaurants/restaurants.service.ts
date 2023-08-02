import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantRepository } from './restaurant.repository';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { User } from '../users/schemas/user.schema';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private restaurantRepo: RestaurantRepository,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

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

  async findOne(id: any) {
    return this.restaurantRepo.findOne(id);
  }

  async restaurantsStats(): Promise<any[]> {
    return this.restaurantModel
      .aggregate([
        {
          $match: { ratingsAverage: { $gte: 4 } },
        },
        {
          $lookup: {
            from: 'meals',
            localField: 'meals',
            foreignField: '_id',
            as: 'mealsData',
          },
        },
        {
          $unwind: {
            path: '$mealsData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: { $toUpper: '$category' },
            numRestaurants: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            minPrice: { $min: '$mealsData.price' },
            maxPrice: { $max: '$mealsData.price' },
            avgPrice: { $avg: '$mealsData.price' },
          },
        },
        {
          $sort: { avgPrice: 1 },
        },
      ])
      .exec();
  }

  async getCheapestRestaurants(): Promise<Restaurant[]> {
    return this.restaurantModel
      .aggregate([
        {
          $lookup: {
            from: 'meals',
            localField: 'meals',
            foreignField: '_id',
            as: 'mealsData',
          },
        },
        {
          $unwind: '$mealsData',
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            email: { $first: '$email' },
            description: { $first: '$description' },
            phoneNo: { $first: '$phoneNo' },
            category: { $first: '$category' },
            user: { $first: '$user' },
            meals: { $push: '$mealsData' },
          },
        },
        {
          $addFields: {
            minPrice: { $min: '$meals.price' },
          },
        },
        {
          $sort: { minPrice: 1 },
        },
        {
          $limit: 5,
        },
      ])
      .exec();
  }

  async getFiveExpensive() {
    return this.restaurantModel
      .aggregate([
        {
          $lookup: {
            from: 'meals',
            localField: 'meals',
            foreignField: '_id',
            as: 'mealsData',
          },
        },
        {
          $unwind: '$mealsData',
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            email: { $first: '$email' },
            description: { $first: '$description' },
            phoneNo: { $first: '$phoneNo' },
            category: { $first: '$category' },
            user: { $first: '$user' },
            meals: { $push: '$mealsData' },
          },
        },
        {
          $addFields: {
            maxPrice: { $max: '$meals.price' },
          },
        },
        {
          $sort: { maxPrice: -1 },
        },
        {
          $limit: 5,
        },
      ])
      .exec();
  }
}
