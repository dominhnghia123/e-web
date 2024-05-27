import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressModule } from './address/address.module';
import { CouponModule } from './coupon/coupon.module';
import { RequestSellerModule } from './requestSeller/requestSeller.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        STRIPE_WEBHOOK_SECRET: Joi.string(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    MulterModule.register({ dest: './uploads' }),
    UserModule,
    ProductModule,
    BrandModule,
    CartModule,
    OrderModule,
    AddressModule,
    CouponModule,
    RequestSellerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
