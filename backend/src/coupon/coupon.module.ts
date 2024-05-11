import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Coupon, CouponSchema } from './coupon.schema';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
