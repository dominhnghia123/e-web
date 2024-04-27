import { ApiProperty } from "@nestjs/swagger";

export class ChangeQuantityProductDto {
    @ApiProperty({ example: '662bbee275ece3b14b4d2f0d' })
    cartId: string;

    @ApiProperty({ example: '662bbee275ece3b14b4d2f0f' })
    newQuantity: number;
}