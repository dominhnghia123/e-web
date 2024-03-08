import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'hien123' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'abc@gmail.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  password: string;

  @ApiProperty({ example: '0123456789' })
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Must be a valid Vietnamese phone number' })
  mobile: string;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty({ message: 'Please pick your role' })
  role: string;
}
