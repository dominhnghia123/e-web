import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from '../brand/brand.schema';
import { Category } from '../category/category.schema';
import { User } from '../user/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      screen_size: { type: Number, required: true },
      memory: { type: Number, required: true },
      pin: { type: Number, required: true },
      ram: { type: Number, required: true },
    },
    required: true,
  })
  specifications: {
    screen_size: number;
    memory: number;
    pin: number;
    ram: number;
  };

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  sold: number;

  @Prop({ required: true })
  color: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true })
  brand: Brand;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @Prop({ required: true })
  images: string[];

  @Prop({
    type: {
      name: { type: String, required: true },
      expiry: { type: String, required: true },
      discount: { type: String, required: true },
    },
    timestamp: true,
  })
  coupons: Array<{ name: string; expiry: string; discount: string }>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  seller: User;

  @Prop()
  likes: number;

  @Prop()
  dislikes: number;

  @Prop()
  numViews: number;

  @Prop()
  isLiked: boolean;

  @Prop()
  isDisliked: boolean;

  @Prop({
    type: {
      star: { type: Number },
      comment: { type: String },
      posted: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    timestamp: true,
  })
  ratings: Array<{ star: number; comment: string; posted: User }>;

  @Prop()
  totalRatings: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
