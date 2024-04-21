import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'UserId cannot be empty' })
  _id: string;

  @ApiProperty({ example: 'male' })
  @IsOptional()
  gender: string;

  @ApiProperty({ example: '2024-03-08T03:59:22.164+00:00' })
  @IsOptional()
  birthday: string;

  @ApiProperty({ example: 'http://localhost:8000/avatar.jpg' })
  @IsOptional()
  avatar: string;
}
