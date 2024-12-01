import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Apple' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @ApiProperty({ example: '0374681416' })
  @IsNotEmpty({ message: 'Phone cannot be empty' })
  phone: string;

  @ApiProperty({ example: 'Việt Nam' })
  @IsNotEmpty({ message: 'Address cannot be empty' })
  address: string;
}
