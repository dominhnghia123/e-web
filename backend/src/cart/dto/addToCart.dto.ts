import { ApiProperty } from "@nestjs/swagger";

export class AddToCartDto {
    @ApiProperty({ example: '662bbee275ece3b14b4d2f0d' })
    productId: string;

    @ApiProperty({ example: '662bbee275ece3b14b4d2f0f' })
    variantId: string;

    @ApiProperty({ example: 10 })
    quantity: number;
}