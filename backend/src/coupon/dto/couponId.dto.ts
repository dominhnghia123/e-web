import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CouponIdDto {
    @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
    @IsNotEmpty({ message: 'Id cannot be empty' })
    _id: string;
}
