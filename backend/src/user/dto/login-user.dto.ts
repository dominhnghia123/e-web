import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'nghia@gmail.com' })
  @IsEmail({}, { message: 'Địa chỉ Email phải đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng điền địa chỉ email.' })
  email: string;

  @ApiProperty({ example: 'nghia' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  password: string;
}
