import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../user/user.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Request } from 'express';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import RequestWithRawBody from '../utils/stripe/requestWithRawBody.interface';
import { OrderIdDto } from './dto/orderId.dto';

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

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-orders-by-user')
  getAllOrdersByUser(@Req() req: Request) {
    return this.orderService.getAllOrdersByUser(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-user-order-pending')
  getUserOrderPending(@Req() req: Request) {
    return this.orderService.getUserOrderPending(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-order-status')
  updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(updateOrderStatusDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/payment-order')
  paymentOrder(@Req() req: RequestWithRawBody) {
    return this.orderService.paymentOrder(req);
  }

  @Post('/get-webhook-stripe')
  getWebhookStripe(@Req() req: RequestWithRawBody) {
    return this.orderService.getWebhookStripe(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/cancel-order')
  cancelOrder(@Body() orderIdDto: OrderIdDto) {
    return this.orderService.cancelOrder(orderIdDto);
  }
}
