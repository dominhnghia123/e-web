import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UserIdDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'id should be fill in' })
  id: string;
}
