import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: '66320764439e93f91f33965c' })
  addressId: string;

  @ApiProperty({ example: '66320764439e93f91f33965c' })
  couponId: string;

  @ApiProperty({
    example: [
      {
        cartId: '66320764439e93f91f33965c',
        productId: '66320764439e93f91f33965c',
        variantId: '66320764439e93f91f33965e',
        quantity: '1',
        price: '23',
      },
      {
        cartId: '66320764439e93f91f33965c',
        productId: '662c5a7ba3f83a303fe165ee',
        variantId: '662c5a7ba3f83a303fe165f1',
        quantity: '45',
        price: '56',
      },
    ],
  })
  @IsNotEmpty({ message: 'OrderItems cannot be empty' })
  orderItems: {
    cartId: string;
    productId: string;
    variantId: string;
    quantity: string;
    price: string;
  }[];
}
