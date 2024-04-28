import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { brandEnum } from '../utils/variableGlobal';

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

  @Prop({
    required: true,
    type: [
      {
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        sold: { type: Number, required: true },
        color: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
  })
  variants: {
    _id: any;
    quantity: number;
    price: number;
    sold: number;
    color: string;
    image: string;
  }[];

  @Prop({ required: true, enum: brandEnum })
  brand: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  seller: User;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  dislikes: number;

  @Prop({ default: 0 })
  numViews: number;

  @Prop({ default: false })
  isLiked: boolean;

  @Prop({ default: false })
  isDisliked: boolean;

  @Prop({
    type: [
      {
        star: { type: Number },
        comment: { type: String },
        posted: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  ratings: { star: number; comment: string; posted: User, createdAt: Date }[];

  @Prop({ default: 0 })
  totalRatings: number;
  _id: any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
