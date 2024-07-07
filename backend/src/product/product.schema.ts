import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { colorEnum } from '../utils/variableGlobal';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: {
      screen_size: { type: String },
      memory: { type: String },
      pin: { type: String },
      ram: { type: String },
    },
    required: true,
  })
  specifications: {
    screen_size: string;
    memory: string;
    pin: string;
    ram: string;
  };

  @Prop({
    required: true,
    type: [
      {
        quantity: { type: String },
        price: { type: String },
        sold: { type: String, default: '0' },
        color: { type: String, enum: colorEnum },
        image: { type: String },
      },
    ],
  })
  variants: {
    _id: any;
    quantity: string;
    price: string;
    sold: string;
    color: string;
    image: string;
  }[];

  @Prop({ required: true })
  brand: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  seller: User;

  @Prop({
    type: [
      {
        star: { type: String },
        comment: { type: String },
        posted: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  ratings: { star: string; comment: string; posted: User; createdAt: Date }[];

  @Prop({ default: '0' })
  totalRatings: string;

  _id: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
