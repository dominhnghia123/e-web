import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  @Prop()
  refreshToken: string;

  @Prop({ default: Array })
  cart: string[];

  @Prop({ default: Array })
  coupons: string[];

  @Prop()
  passwordChangeAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExquires: Date;

  // eslint-disable-next-line @typescript-eslint/ban-types
  isMatchedPassword: Function;

  // eslint-disable-next-line @typescript-eslint/ban-types
  createPasswordResetToken: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  try {
    if (!this.isModified('password')) {
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

UserSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');
  this.passwordResetExquires = Date.now() + 30 * 60 * 1000; //10 minutes
  return resettoken;
};
