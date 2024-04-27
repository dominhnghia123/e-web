import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from '../product/product.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: Product;

  @Prop({ required: true})
  variantId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
