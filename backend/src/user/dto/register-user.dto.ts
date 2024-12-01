import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'nghia' })
  @Length(4, 20, { message: 'Tên đăng nhập phải có độ dài từ 4 đến 20 ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng điền tên đăng nhập.' })
  username: string;

  @ApiProperty({ example: 'nghia@gmail.com' })
  @IsEmail({}, { message: 'Địa chỉ Email phải đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng điền địa chỉ email.' })
  email: string;

  @ApiProperty({ example: 'nghia' })
  @MinLength(4, { message: 'Mật khẩu phải có ít nhất 4 ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  password: string;

  @ApiProperty({ example: '0374681416' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại phải đúng định dạng VN.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  mobile: string;
}
