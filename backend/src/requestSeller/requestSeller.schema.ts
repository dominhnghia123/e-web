import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { statusRequestSellerEnum } from '../utils/variableGlobal';

export type RequestSellerDocument = HydratedDocument<RequestSeller>;

@Schema({ timestamps: true })
export class RequestSeller {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    userId: User

    @Prop({ default: '', required: true })
    shopName: string;

    @Prop({ default: '', required: true })
    addressGetGoods: string;

    @Prop({ default: '', required: true })
    cccd: string;

    @Prop({ default: '', required: true })
    fullName: string;

    @Prop({ default: statusRequestSellerEnum.pending, required: true, enum: statusRequestSellerEnum })
    status: string;
}

export const RequestSellerSchema = SchemaFactory.createForClass(RequestSeller);
