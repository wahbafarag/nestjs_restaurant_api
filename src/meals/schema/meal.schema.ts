import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import mongoose from 'mongoose';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

export enum Category {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  SANDWICHES = 'Sandwiches',
  PASTA = 'Pasta',
}

@Schema({ timestamps: true })
export class Meal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  mealDiscount?: number;

  @Prop({ required: true })
  category: Category;

  @Prop({
    required: true,
    errorMessafe: 'Meal should belong to a user',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    required: true,
    errorMessage: 'Meal should belong to a restaurant',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant: Restaurant;

  validateDiscount() {
    return this.mealDiscount < this.price;
  }
}

export const mealSchema = SchemaFactory.createForClass(Meal);
