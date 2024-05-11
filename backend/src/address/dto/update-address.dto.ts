import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ example: '65ea8d744f3d63f2131bfe47' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  _id: string;

  @ApiProperty({ example: 'Apple' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @ApiProperty({ example: '0975191025' })
  @IsNotEmpty({ message: 'Phone cannot be empty' })
  phone: string;

  @ApiProperty({ example: 'Việt Nam' })
  @IsNotEmpty({ message: 'Address cannot be empty' })
  address: string;
}
