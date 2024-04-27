import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddToCartDto } from './dto/addToCart.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { RemoveProductDto } from './dto/removeProduct.dto';
import { UserIdDto } from '../user/dto/userId.dto';
import { ChangeQuantityProductDto } from './dto/changeQuantityProduct.dto';

@ApiTags('Cart')
@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) { }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/add-to-cart')
  addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: Request) {
    return this.cartService.addToCart(addToCartDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/remove-product')
  removeProductFromCart(@Body() removeProductDto: RemoveProductDto, @Req() req: Request) {
    return this.cartService.removeProductFromCart(removeProductDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-cart')
  getCart(@Req() req: Request) {
    return this.cartService.getCart(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/change-quantity-product')
  changeQuantityProductInCart(@Body() changeQuantityProductDto: ChangeQuantityProductDto, @Req() req: Request) {
    return this.cartService.changeQuantityProductInCart(changeQuantityProductDto, req);
  }
}
