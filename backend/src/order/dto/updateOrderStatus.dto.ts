import { ApiProperty } from '@nestjs/swagger';
import { statusEnum } from '../../utils/variableGlobal';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: '662c5a7ba3f83a303fe165ee' })
  orderId: string;

  @ApiProperty({ example: statusEnum.done })
  status: string;
}
