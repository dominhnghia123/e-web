import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Iphone 11' })
  @IsNotEmpty({ message: 'Vui lòng điền tên sản phẩm.' })
  name: string;

  @ApiProperty({ example: 'Iphone-11' })
  @IsNotEmpty({ message: 'Vui lòng điền slug.' })
  slug: string;

  @ApiProperty({ example: 'Sản phẩm đẹp' })
  @IsNotEmpty({ message: 'Vui lòng điền mô tả sản phẩm.' })
  description: string;

  @ApiProperty({ example: 'iphone' })
  @IsNotEmpty({ message: 'Vui lòng chọn thương hiệu sản phẩm.' })
  brand: string;

  @ApiProperty({
    example: { screen_size: '123', memory: '128', pin: '100', ram: '64' },
  })
  specifications: {
    screen_size: string;
    memory: string;
    pin: string;
    ram: string;
  };

  @ApiProperty({
    example: [
      {
        quantity: '20',
        price: '28',
        color: 'black',
        image: 'http://localhost:8000/api/app/iphone.png',
      },
      {
        quantity: '30',
        price: '38',
        color: 'white',
        image: 'http://localhost:8000/api/app/iphone.png',
      },
    ],
  })
  variants: {
    quantity: string;
    price: string;
    color: string;
    image: string;
  }[];
}
