import { ApiProperty } from '@nestjs/swagger';

export class OrderIdDto {
  @ApiProperty({ example: '662c5a7ba3f83a303fe165ee' })
  orderId: string;
}
