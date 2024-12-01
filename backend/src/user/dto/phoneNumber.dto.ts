import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty({ example: '0374681416' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại phải đúng định dạng VN.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  mobile: string;
}
