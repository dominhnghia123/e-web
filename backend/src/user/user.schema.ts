import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Cart } from '../cart/cart.schema';
import { Product } from '../product/product.schema';
import { genderEnum } from '../utils/variableGlobal';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop({ required: true, default: 'user' })
  role: string;

  @Prop({ default: false })
  isSeller: boolean;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  birthday: string;

  @Prop({ default: null, enum: genderEnum })
  gender: string;

  @Prop({ default: 0 })
  followers: number;

  @Prop({ default: 0 })
  numFollows: number;

  @Prop({ default: false })
  isFollowed: boolean;

  @Prop()
  refreshToken: string;

  @Prop({ default: Array })
  cart: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null })
  wishlist: Product[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null })
  warehouses: Product[];

  // eslint-disable-next-line @typescript-eslint/ban-types
  isMatchedPassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.isMatchedPassword = async function (enterPassword: string) {
  return await bcrypt.compare(enterPassword, this.password);
};
