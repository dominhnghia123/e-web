import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.schema';

export class CreateCouponDto {
  @ApiProperty({ example: '662dc4d2f03d0525993d0a3b' })
  @IsNotEmpty({ message: 'Điền tên người được hưởng.' })
  userId: User;

  @ApiProperty({ example: 'Voucher cuối năm' })
  @IsNotEmpty({ message: 'Điền tên khuyến mãi.' })
  name: string;

  @ApiProperty({ example: '2024-15-11' })
  @IsNotEmpty({ message: 'Điền ngày hết hạn khuyến mãi.' })
  expiry: string;

  @ApiProperty({ example: '40' })
  @IsNotEmpty({ message: 'Điền lượng giảm giá.' })
  discount: string;
}
