import { Injectable } from '@nestjs/common';
import { Review } from './schemas/rating.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { User } from '../users/schemas/user.schema';
import {RatingRepository} from "./rating.repository";
import {UpdateRatingDto} from "./dtos/update-rating.dto";

@Injectable()
export class RatingsService {
    constructor(private ratingsRepository: RatingRepository, private restaurantsService: RestaurantsService){
    }

    async create(review: CreateRatingDto, user: User): Promise<Review> {
        return  await  this.ratingsRepository.create(review,
            user);
    }

    async update(id: string, review: UpdateRatingDto, user: User):Promise<Review>{
        return await  this.ratingsRepository.update(id, review, user)
    }
    async delete(id:string):Promise<void>{
        return this.ratingsRepository.delete(id)
    }
}
