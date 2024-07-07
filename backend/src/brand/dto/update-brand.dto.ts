import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBrandDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  _id: string;

  @ApiProperty({ example: 'Apple' })
  @IsNotEmpty({ message: 'Vui lòng điền nhãn hiệu.' })
  name: string;
}
