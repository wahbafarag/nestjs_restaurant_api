import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { User } from '../users/schemas/user.schema';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel('Restaurant') private restaurantModel: Model<Restaurant>,
  ) {}

  async create(body: CreateRestaurantDto, user: User): Promise<Restaurant> {
    // const restaurant = await this.restaurantModel.create(body);
    // restaurant.user = user._id;
    // await restaurant.save();
    // return restaurant;
    const data = Object.assign(body, { user: user._id });
    const restaurant = (await this.restaurantModel.create(data)).populate(
      'user',
      'name email role',
    );
    return restaurant;
  }

  async update(
    resId: string,
    body: UpdateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      resId,
      body,
      { new: true, runValidators: true },
    );
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    restaurant.user = user._id;
    await restaurant.save();
    return restaurant.populate('user', 'name email role');
  }

  async findAll(query: any): Promise<Restaurant[]> {
    // Pagination
    const resultsPerPage = 4;
    const currentPage = Number(query.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);

    // search
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i', // case sensitive
          },
        }
      : {};
    return this.restaurantModel
      .find()
      .find(keyword)
      .limit(resultsPerPage)
      .skip(skip)
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('meals ratings');
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate('ratings meals');
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant.populate('user ratingsQuantity', 'name email');
  }

  async findOne(id: any) {
    return this.restaurantModel.findOne({ _id: id });
  }

  async delete(id: string): Promise<void> {
    const restaurant = await this.restaurantModel.findByIdAndDelete(id);
  }
}
