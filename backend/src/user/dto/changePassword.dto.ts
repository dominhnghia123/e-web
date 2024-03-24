import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'hien123' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại' })
  currentPassword: string;

  @ApiProperty({ example: 'hien123456' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới' })
  newPassword: string;

  @ApiProperty({ example: 'hien123456' })
  @IsNotEmpty({ message: 'Vui lòng xác nhận lại mật khẩu' })
  confirmPassword: string;
}
