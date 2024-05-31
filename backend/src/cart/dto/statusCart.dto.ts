import { ApiProperty } from '@nestjs/swagger';
import { statusDeliveryEnum } from '../../utils/variableGlobal';

export class StatusCartDto {
  @ApiProperty({ example: statusDeliveryEnum.notPaymentDone })
  status: string;
}
