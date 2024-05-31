import { ApiProperty } from '@nestjs/swagger';
import { statusDeliveryEnum } from '../../utils/variableGlobal';

export class UpdateStatusDeliveryCartDto {
  @ApiProperty({ example: '662c5a7ba3f83a303fe165ee' })
  cartId: string;

  @ApiProperty({ example: statusDeliveryEnum.shipping })
  status: string;
}
