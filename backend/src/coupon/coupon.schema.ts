import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    userId: User

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    expiry: string

    @Prop({ required: true })
    discount: string
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
