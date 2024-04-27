import { ApiProperty } from "@nestjs/swagger";

export class RemoveProductDto{
    @ApiProperty({ example: '662bbee275ece3b14b4d2f0d' })
    cartId: string;
}