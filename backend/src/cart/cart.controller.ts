import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddToCartDto } from './dto/addToCart.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { RemoveProductDto } from './dto/removeProduct.dto';
import { ChangeQuantityProductDto } from './dto/changeQuantityProduct.dto';
import { UpdateStatusDeliveryCartDto } from './dto/updateStatusDeliveryCart.dto';
import { StatusCartDto } from './dto/statusCart.dto';

@ApiTags('Cart')
@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/add-to-cart')
  addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: Request) {
    return this.cartService.addToCart(addToCartDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/remove-product')
  removeProductFromCart(
    @Body() removeProductDto: RemoveProductDto,
    @Req() req: Request,
  ) {
    return this.cartService.removeProductFromCart(removeProductDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-status-delivery-many-products')
  updateStatusDeliveryManyProductsFromCart(@Req() req: Request) {
    return this.cartService.updateStatusDeliveryManyProductsFromCart(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-cart-not-ordered-yet')
  getCartNotOrderedYet(@Req() req: Request) {
    return this.cartService.getCartNotOrderedYet(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-carts-by-id')
  getCartsById(@Req() req: Request) {
    return this.cartService.getCartsById(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/change-quantity-product')
  changeQuantityProductInCart(
    @Body() changeQuantityProductDto: ChangeQuantityProductDto,
    @Req() req: Request,
  ) {
    return this.cartService.changeQuantityProductInCart(
      changeQuantityProductDto,
      req,
    );
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-status-delivery-cart')
  updateStatusDeliveryCart(
    @Body() updateStatusDeliveryCartDto: UpdateStatusDeliveryCartDto,
    @Req() req: Request,
  ) {
    return this.cartService.updateStatusDeliveryCart(
      updateStatusDeliveryCartDto,
      req,
    );
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-carts-by-status')
  getCartsByStatus(@Body() statusCart: StatusCartDto, @Req() req: Request) {
    return this.cartService.getCartsByStatus(statusCart, req);
  }
}
