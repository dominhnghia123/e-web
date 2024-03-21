import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Smart phone' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;
}
