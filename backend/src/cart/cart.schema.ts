import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from '../product/product.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
    required: true,
  })
  products: Array<{ productId: Product; quantity: number; price: number }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
