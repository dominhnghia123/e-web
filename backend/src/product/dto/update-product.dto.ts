import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'ProductId cannot be empty' })
  _id: string;

  @ApiProperty({ example: 'Smart phone' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'smart-phone' })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Mặt hàng này rất gì và này nọ' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: {
      screen_size: 6.7,
      memory: 128,
      pin: 4,
      ram: 8,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  specifications: {
    screen_size: string;
    memory: string;
    pin: string;
    ram: string;
  };

  @ApiProperty({
    example: [
      {
        quantity: 100,
        price: 999,
        sold: 50,
        color: 'black',
        image: 'http://localhost:8000/image.jpg',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  variants: {
    quantity: string;
    price: string;
    sold: string;
    color: string;
    image: string;
  }[];

  @ApiProperty({ example: 'Apple' })
  @IsNotEmpty({ message: 'Brand cannot be empty' })
  brand: string;
}
