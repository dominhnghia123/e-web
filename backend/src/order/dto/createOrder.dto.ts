import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: { address: '48 Tố Hữu' },
  })
  @IsNotEmpty({ message: 'ShippingInfo cannot be empty' })
  shippingInfo: {
    address: string;
  };

  @ApiProperty({
    example: [
      {
        productId: '66320764439e93f91f33965c',
        variantId: '66320764439e93f91f33965e',
        quantity: '1',
        price: '23',
      },
      {
        productId: '662c5a7ba3f83a303fe165ee',
        variantId: '662c5a7ba3f83a303fe165f1',
        quantity: '45',
        price: '56',
      },
    ],
  })
  @IsNotEmpty({ message: 'OrderItems cannot be empty' })
  orderItems: {
    productId: string;
    variantId: string;
    quantity: string;
    price: string;
  }[];

  @ApiProperty({ example: 'pending' })
  status: string;
}
