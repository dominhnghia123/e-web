import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'abc@gmail.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsString()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  password: string;
}
