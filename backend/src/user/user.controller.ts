import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserIdDto } from './dto/userId.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register-user')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('/get-a-user')
  getAUser(@Body() userIdDto: UserIdDto) {
    return this.userService.getAUser(userIdDto);
  }

  @Post('/get-all-users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('/update-user')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Post('/delete-a-user')
  deleteAUser(@Body() userIdDto: UserIdDto) {
    return this.userService.deleteAUser(userIdDto);
  }

  @Post('/delete-many-users')
  deleteManyUsers(@Req() req: Request) {
    return this.userService.deleteManyUser(req);
  }
}
