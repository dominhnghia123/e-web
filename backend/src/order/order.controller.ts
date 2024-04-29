import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}
}
