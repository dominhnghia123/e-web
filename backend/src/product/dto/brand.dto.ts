import { ApiProperty } from '@nestjs/swagger';

export class BrandDto {
  @ApiProperty({ example: 'iphone' })
  brand: string;
}
