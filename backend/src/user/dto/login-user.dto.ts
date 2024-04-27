import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'hien@gmail.com' })
  @IsEmail({}, { message: 'Địa chỉ Email phải đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng điền địa chỉ email.' })
  email: string;

  @ApiProperty({ example: 'hien' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  password: string;
}
