import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.schema';

export class UpdateCouponDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  _id: string;

  @ApiProperty({ example: '662dc4d2f03d0525993d0a3b' })
  @IsNotEmpty({ message: 'Điền tên người được hưởng.' })
  userId: User;

  @ApiProperty({ example: 'Voucher mùa hè' })
  @IsNotEmpty({ message: 'Điền tên khuyến mãi.' })
  name: string;

  @ApiProperty({ example: '2024-03-10' })
  @IsNotEmpty({ message: 'Điền ngày hết hạn khuyến mãi.' })
  expiry: string;

  @ApiProperty({ example: '40' })
  @IsNotEmpty({ message: 'Điền lượng giảm giá.' })
  discount: string;
}
