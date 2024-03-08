import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  birthday: Date;

  @Prop({ unique: true })
  mobile: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  followers: number;

  @Prop()
  numFollows: number;

  @Prop()
  isFollowed: boolean;

  @Prop()
  token: string;

  @Prop()
  refreshToken: string;

  // eslint-disable-next-line @typescript-eslint/ban-types
  isMatchedPassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  try {
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
