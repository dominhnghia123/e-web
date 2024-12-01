import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'nghialangla4@gmail.com' })
  @IsEmail({}, { message: 'Địa chỉ Email phải đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng điền địa chỉ email.' })
  email: string;
}
