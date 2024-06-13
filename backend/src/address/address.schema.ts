import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true, unique: false })
  username: string;

  @Prop({ required: true, unique: false })
  phone: string;

  @Prop({ required: true, unique: false })
  address: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
