import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { statusDeliveryEnum, statusEnum } from '../utils/variableGlobal';
import { Product } from '../product/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  address: string;

  @Prop()
  coupon: string;

  @Prop({
    required: true,
    type: [
      {
        cartId: { type: String },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        variantId: { type: String },
        quantity: { type: String },
        price: { type: String },
      },
    ],
  })
  orderItems: {
    cartId: string;
    productId: Product;
    variantId: string;
    quantity: string;
    price: string;
  }[];

  @Prop({ required: true })
  totalPrice: string;

  @Prop()
  paidAt: string;

  @Prop({ required: true, enum: statusEnum, default: statusEnum.pending })
  status: string;

  @Prop({ default: '' })
  session_id: string;

  @Prop({ default: '' })
  payment_intent_id: string;

  @Prop({
    required: true,
    enum: statusDeliveryEnum,
    default: statusDeliveryEnum.notShippedYet,
  })
  status_delivery: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
