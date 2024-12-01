import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterSellerDto {
  @ApiProperty({ example: 'shop A' })
  @IsNotEmpty({ message: 'Vui lòng điền tên cửa hàng.' })
  shopName: string;

  @ApiProperty({ example: 'Khương Trung' })
  @IsNotEmpty({ message: 'Vui lòng điền địa chỉ lấy hàng.' })
  addressGetGoods: string;

  @ApiProperty({ example: '036202010705' })
  @IsNotEmpty({ message: 'Vui lòng nhập căn cước công dân.' })
  cccd: string;

  @ApiProperty({ example: 'Đỗ Minh Nghĩa' })
  @IsNotEmpty({ message: 'Vui lòng nhập đầy đủ họ và tên theo CCCD.' })
  fullName: string;
}
