import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../user/user.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductIdDto } from './dto/productId.dto';
import { Request } from 'express';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandDto } from './dto/brand.dto';

@ApiTags('Product')
@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) { }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/create-product')
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.createProduct(createProductDto, req);
  }

  @Post('/get-a-product')
  getAProduct(@Body() productIdDto: ProductIdDto) {
    return this.productService.getAProduct(productIdDto);
  }

  @Post('/get-all-products')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-product')
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/delete-a-product')
  deleteAProduct(@Body() productIdDto: ProductIdDto) {
    return this.productService.deleteAProduct(productIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/delete-many-products')
  deleteManyProducts(@Req() req: Request) {
    return this.productService.deleteManyProducts(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-ratings')
  getRatings(@Body() productIdDto: ProductIdDto) {
    return this.productService.getRatings(productIdDto);
  }

  @Post('/get-product-by-brand')
  getProductByBrand(@Body() brandDto: BrandDto) {
    return this.productService.getProductByBrand(brandDto);
  }
}
