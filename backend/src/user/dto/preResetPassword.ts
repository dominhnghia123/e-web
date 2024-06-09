import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PreResetPasswordDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Vui lòng nhập mã code' })
  code: string;
}
