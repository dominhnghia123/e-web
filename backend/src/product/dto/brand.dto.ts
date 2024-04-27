import { ApiProperty } from "@nestjs/swagger";
import { brandEnum } from "../../utils/variableGlobal";

export class BrandDto {
    @ApiProperty({ example: 'iphone', enum: brandEnum })
    brand: string
}