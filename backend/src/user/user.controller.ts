import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserIdDto } from './dto/userId.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { UserGuard } from './user.guard';
import { AdminGuard } from './admin.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PhoneNumberDto } from './dto/phoneNumber.dto';
import { RegisterSellerDto } from '../requestSeller/dto/register-seller.dto';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('/register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  @Post('/login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.login(loginUserDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/refreshToken')
  handleRefreshToken(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;
    return this.userService.handleRefreshToken(refreshToken);
  }

  @Post('/get-a-user')
  getAUser(@Body() userIdDto: UserIdDto) {
    return this.userService.getAUser(userIdDto);
  }

  @Post('/get-all-users')
  getAllUsers(@Req() req: Request) {
    return this.userService.getAllUsers(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-user')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-a-user')
  deleteAUser(@Body() userIdDto: UserIdDto) {
    return this.userService.deleteAUser(userIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-many-users')
  deleteManyUsers(@Req() req: Request) {
    return this.userService.deleteManyUser(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return this.userService.changePassword(changePasswordDto, req);
  }

  @Post('/check-already-phone-number')
  checkAlreadyPhoneNumber(@Body() phoneNumberDto: PhoneNumberDto) {
    return this.userService.checkAlreadyPhoneNumber(phoneNumberDto);
  }
}
