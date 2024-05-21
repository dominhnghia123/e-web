import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { statusEnum } from '../utils/variableGlobal';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: {
      address: { type: String },
    },
    required: true,
  })
  shippingInfo: { address: string };

  @Prop({
    required: true,
    type: [
      {
        productId: { type: String },
        variantId: { type: String },
        quantity: { type: String },
        price: { type: String },
      },
    ],
  })
  orderItems: {
    productId: string;
    variantId: string;
    quantity: string;
    price: string;
  }[];

  @Prop({ required: true })
  totalPrice: string;

  @Prop({ required: true })
  paidAt: string;

  @Prop({ required: true, enum: statusEnum })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
