import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Apple' })
  @IsNotEmpty({ message: 'Điền tên thương hiệu.' })
  name: string;
}
