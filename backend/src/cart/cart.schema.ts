import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from '../product/product.schema';
import { statusDeliveryEnum } from '../utils/variableGlobal';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  productId: Product;

  @Prop({ required: true })
  variantId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: statusDeliveryEnum, default: statusDeliveryEnum.notOrderedYet })
  status_delivery: string;

  @Prop()
  orderId: string;

  @Prop()
  sellerId: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
