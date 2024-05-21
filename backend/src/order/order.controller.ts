import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../user/user.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Request } from 'express';

@ApiTags('Order')
@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/create-order')
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.createOrder(createOrderDto, req);
  }
}
