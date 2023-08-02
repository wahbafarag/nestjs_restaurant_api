import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/rating.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { User } from '../users/schemas/user.schema';
import { UpdateRatingDto } from './dtos/update-rating.dto';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectModel('Review') private reviewModel: Model<Review>,
    private restaurantService: RestaurantsService,
    @InjectModel('Restaurant') private restaurantModel: Model<'Restaurant'>,
  ) {}

  async create(review: CreateRatingDto, user: User): Promise<Review> {
    const data = Object.assign(review, { user: user._id });

    const restaurant = await this.restaurantService.findOne(review.restaurant);
    if (!restaurant)
      throw new NotFoundException(
        'Restaurant not found ,Make sure you are using the correct id',
      );

    const reviewExist = await this.reviewModel.findOne({ user, restaurant });
    if (reviewExist)
      throw new ConflictException('You already reviewed this restaurant');

    const createdReview = new this.reviewModel(data);

    if (!restaurant.ratings) {
      restaurant.ratings = [];
    }
    restaurant.ratings.push(createdReview);
    restaurant.ratingsQuantity = (restaurant.ratingsQuantity || 0) + 1;
    await restaurant.save();
    await createdReview.save();
    await this.updateRatingsAverage(review.restaurant);
    return createdReview;
  }

  async update(
    id: string,
    review: UpdateRatingDto,
    user: User,
  ): Promise<Review> {
    return this.reviewModel.findByIdAndUpdate(id, review, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<void> {
    await this.reviewModel.findByIdAndDelete(id);
  }

  async updateRatingsAverage(restaurantId: Restaurant): Promise<void> {
    const restaurant = await this.restaurantService.findOne(restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const reviews = await this.reviewModel
      .find({ restaurant: restaurantId })
      .exec();
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const newAverage = totalRatings / reviews.length;

    restaurant.ratingsAverage = Math.round(newAverage * 10) / 10;
    await restaurant.save();
  }
}
