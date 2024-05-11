import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.schema';

export class UpdateCouponDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  _id: string;

  @ApiProperty({ example: '662dc4d2f03d0525993d0a3b' })
  @IsNotEmpty({ message: 'UserId cannot be empty' })
  userId: User;

  @ApiProperty({ example: 'Voucher mùa hè' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ example: '2024-03-10' })
  @IsNotEmpty({ message: 'Expiry cannot be empty' })
  expiry: string;

  @ApiProperty({ example: '40' })
  @IsNotEmpty({ message: 'Discount cannot be empty' })
  discount: string;
}
