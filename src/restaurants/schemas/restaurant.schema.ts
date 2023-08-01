import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Meal } from '../../meals/schema/meal.schema';
import { Review } from '../../ratings/schemas/rating.schema';

export enum Category {
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  phoneNo: string;

  @Prop({ required: true })
  category: Category;

  @Prop()
  images?: object[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }] })
  meals?: Meal[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
  ratings?: Review[];

  async save() {
    await this.save();
  }
}

export const restaurantSchema = SchemaFactory.createForClass(Restaurant);
