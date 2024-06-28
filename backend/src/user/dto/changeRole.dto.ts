import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'UserId cannot be empty' })
  userId: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}
