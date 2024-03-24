import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterSellerDto {
  @ApiProperty({ example: 'hien' })
  @Length(4, 20, { message: 'Tên đăng nhập phải có độ dài từ 4 đến 20 ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng điền tên đăng nhập.' })
  username: string;

  @ApiProperty({ example: 'hien@gmail.com' })
  @IsEmail({}, { message: 'Địa chỉ Email phải đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng điền địa chỉ email.' })
  email: string;

  @ApiProperty({ example: 'hien' })
  @MinLength(4, { message: 'Mật khẩu phải có ít nhất 4 ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  password: string;

  @ApiProperty({ example: '0975191025' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại phải đúng định dạng VN.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  mobile: string;
}
