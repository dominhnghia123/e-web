import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from '../product/product.schema';
import { paymentsEnum, statusEnum } from '../utils/variableGlobal';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: {
      address: { type: String, required: true },
    },
    required: true,
  })
  shippingInfo: { address: string };

  @Prop({
    required: true,
    type: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  })
  orderItems: { productId: Product; quantity: number; price: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true, enum: paymentsEnum })
  payment: string;

  @Prop({ required: true })
  paidAt: Date;

  @Prop({ required: true, enum: statusEnum })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
