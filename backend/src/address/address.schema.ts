import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true, unique: false })
  username: string;

  @Prop({ required: true, unique: false })
  phone: string;

  @Prop({ required: true, unique: false })
  address: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
