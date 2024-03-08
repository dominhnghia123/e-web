import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BrandModule } from '../brand/brand.module';
import { Category } from '../category/category.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    BrandModule,
    Category,
    UserModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
