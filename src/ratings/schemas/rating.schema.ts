import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

@Schema({ timestamps: true })
export class Review {
  @Prop()
  comment: string;

  @Prop({ required: true })
  rating: number;

  @Prop({
    required: true,
    errorMessage: 'Review must belong to restaurant',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    required: true,
    errorMessage: 'Review must belong to restaurant',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant: Restaurant;
}

export const ratingSchema = SchemaFactory.createForClass(Review);
