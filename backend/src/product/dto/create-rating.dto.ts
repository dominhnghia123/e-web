import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: '662bbee275ece3b14b4d2f0d' })
  @IsNotEmpty({ message: 'Hãy nhập id của product' })
  productId: string;

  @ApiProperty({ example: '5' })
  @IsNotEmpty({ message: 'Vui lòng đánh giá mức độ hài lòng của bạn' })
  star: number;

  @ApiProperty({
    example:
      'Sản phẩm chất lượng cao, tốt, giao hàng nhanh, uy tín, nói chung là quá tuyệt vời.',
  })
  @IsNotEmpty({
    message: 'Vui lòng điền nhận xét của bạn về sản phẩm của chúng tôi',
  })
  comment: string;
}
