import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserModule } from '../user/user.module';
import { Product, ProductSchema } from '../product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
