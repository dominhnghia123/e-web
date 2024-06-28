import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserIdDto } from './dto/userId.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PhoneNumberDto } from './dto/phoneNumber.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AppService } from '../app.service';
import { PreResetPasswordDto } from './dto/preResetPassword';
import * as crypto from 'crypto';
import { ChangeRoleDto } from './dto/changeRole.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private appService: AppService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { username, email, password, mobile } = registerUserDto;
    try {
      if (await this.userModel.findOne({ username: username })) {
        return {
          property: 'username',
          msg: 'Tên người dùng này đã tồn tại.',
          status: false,
        };
      }

      if (await this.userModel.findOne({ email: email })) {
        return {
          property: 'email',
          msg: 'Địa chỉ email đã tồn tại.',
          status: false,
        };
      }
      if (mobile.length != 10) {
        return {
          property: 'mobile',
          msg: 'Số điện thoại không hợp lệ.',
          status: false,
        };
      }
      if (await this.userModel.findOne({ mobile: mobile })) {
        return {
          property: 'mobile',
          msg: 'Số điện thoại này đã được sử dụng.',
          status: false,
        };
      }

      const newUser = await this.userModel.create({
        username: username,
        email: email,
        password: password,
        mobile: mobile,
      });
      const payload = { email: email, username: username };

      return {
        msg: 'Đăng ký thành công!',
        status: true,
        newUser: {
          ...JSON.parse(JSON.stringify(newUser)),
          token: await this.jwtService.signAsync(payload),
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response): Promise<any> {
    const { email, password } = loginUserDto;
    try {
      const findUser = await this.userModel.findOne({ email: email });
      if (!findUser) {
        return {
          msg: 'Thông tin đăng nhập không chính xác',
          status: false,
        };
      }

      if (findUser && !(await findUser.isMatchedPassword(password))) {
        return {
          msg: 'Thông tin đăng nhập không chính xác',
          status: false,
        };
      }

      const payload = { email: findUser.email, username: findUser.username };
      const payload1 = { email: findUser.email, mobile: findUser.mobile };

      const refreshToken = await this.jwtService.signAsync(payload1, {
        expiresIn: '3d',
      });

      await this.userModel.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        },
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      return {
        msg: 'Đăng nhập thành công',
        status: true,
        currentUser: {
          _id: findUser._id,
          username: findUser.username,
          email: findUser.email,
          mobile: findUser.mobile,
          role: findUser.role,
          isSeller: findUser.isSeller,
          token: await this.jwtService.signAsync(payload),
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async handleRefreshToken(refreshToken: string) {
    try {
      const user = await this.userModel.findOne({ refreshToken: refreshToken });
      if (!user) {
        throw new UnauthorizedException('Not authorization');
      }

      const decoded = await this.jwtService.decode(refreshToken);
      if (decoded.exp < new Date().getTime() / 1000) {
        // refreshToken hết hạn
        return new ForbiddenException(
          'Refresh Token is expired or error. Please login again',
        );
      } else {
        //refreshToken còn hạn
        const payload = {
          email: user.email,
          role: user.role,
        };
        const newToken = await this.jwtService.signAsync(payload);
        return {
          newToken: newToken,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAUser(userIdDto: UserIdDto) {
    try {
      const { _id } = userIdDto;
      const findUser = await this.userModel.findById(_id);
      if (!findUser) {
        return {
          msg: 'Không tìm thấy người dùng này!',
          status: false,
        };
      }
      return {
        msg: 'Người dùng được tìm thấy thành công.',
        status: true,
        user: {
          _id: findUser._id,
          username: findUser?.username,
          email: findUser?.email,
          mobile: findUser?.mobile,
          avatar: findUser?.avatar,
          role: findUser?.role,
          isSeller: findUser?.isSeller,
          birthday: findUser?.birthday,
          gender: findUser?.gender,
          cart: findUser?.cart,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllUsers(req: Request) {
    const keySearch: string = req.query?.s?.toString();
    const currentPage: number = req.query.page as any;
    const itemsPerPage: number = req.query.limit as any;
    try {
      let options = {};

      if (keySearch) {
        options = {
          $or: [
            { name: new RegExp(keySearch, 'i') },
            { email: new RegExp(keySearch, 'i') },
          ],
        };
      }
      const allUsers = await this.userModel
        .find(options)
        .sort({ username: 'asc' });
      const page: number = currentPage || 1;
      const limit: number = itemsPerPage || 10;
      const skip: number = (page - 1) * limit;

      const totalUsers = await this.userModel.countDocuments(options);
      const data = allUsers.slice(
        skip,
        parseInt(skip.toString()) + parseInt(limit.toString()),
      );
      return {
        status: true,
        users: data,
        totalUsers,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { _id, gender, birthday, avatar } = updateUserDto;
    try {
      const user = await this.userModel.findById(_id);
      if (!user) {
        return {
          msg: 'This user not exists',
          status: false,
        };
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        _id,
        {
          birthday: birthday,
          gender: gender,
          avatar: avatar,
        },
        {
          new: true,
        },
      );

      return {
        msg: 'Updated user successfully',
        status: true,
        updatedUser: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteAUser(userIdDto: UserIdDto) {
    const { _id } = userIdDto;
    try {
      const user = await this.userModel.findById(_id);
      if (!user) {
        return {
          msg: 'This user is not exist',
          status: false,
        };
      }

      const deletedUser = await this.userModel.findByIdAndDelete(_id);
      return {
        msg: 'Deleted this user successfully',
        status: true,
        deletedUser: deletedUser,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteManyUser(req: Request) {
    const { userIds } = req.body;
    try {
      const deleteManyUser = await this.userModel.deleteMany({
        _id: { $in: userIds },
      });
      return {
        msg: 'Deleted users successfully',
        status: true,
        deleteManyUser: deleteManyUser,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async changePassword(changePassword: ChangePasswordDto, req: Request) {
    const { currentPassword, newPassword, confirmPassword } = changePassword;
    const currentUser = req['user'];
    try {
      const user = await this.userModel.findById(currentUser._id);
      if (user && !(await user.isMatchedPassword(currentPassword))) {
        return {
          msg: 'Mật khẩu hiện tại không chính xác.',
          status: false,
        };
      }
      if (newPassword !== '' && newPassword.length < 4) {
        return {
          msg: 'Mật khẩu phải có ít nhất 4 ký tự.',
          status: false,
        };
      }

      if (currentPassword === newPassword) {
        return {
          msg: 'Mật khẩu cũ và mật khẩu mới phải khác nhau.',
          status: false,
        };
      }
      if (newPassword !== confirmPassword) {
        return {
          msg: 'Mật khẩu mới và xác nhận mật khẩu phải giống nhau.',
          status: false,
        };
      }
      user.password = newPassword;
      await user.save();
      return {
        msg: 'Thay đổi mật khẩu thành công.',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkAlreadyPhoneNumber(phoneNumberDto: PhoneNumberDto) {
    const { mobile } = phoneNumberDto;
    try {
      const checkAlreadyPhoneNumber = await this.userModel.findOne({ mobile });
      if (checkAlreadyPhoneNumber) {
        return {
          status: true,
        };
      }
      return {
        status: false,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    try {
      const findUser = await this.userModel.findOne({ email });
      if (!findUser) {
        return {
          msg: 'Email này chưa từng được sử dụng',
          status: false,
        };
      }
      const code = await findUser.createPasswordResetToken();

      await findUser.save();

      const message = `Hi guys, Please use the following code to reset your password.\nThis code is valid till 10 minutes from now.\nCode: ${code}`;

      const dataPayload = {
        to: email,
        text: message,
        subject: 'Forgot Password',
      };
      await this.appService.sendEmail(dataPayload);

      return {
        msg: 'Lấy mã thành công.',
        status: true,
        code,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async preResetPassword(preResetPasswordDto: PreResetPasswordDto) {
    const { code } = preResetPasswordDto;
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(code)
        .digest('hex');
      const user = await this.userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExquires: { $gt: Date.now() },
      });
      if (!user) {
        return {
          msg: 'Mã code không chính xác hoặc đã hết hiệu lực. Vui lòng thử lại.',
          status: false,
        };
      }
      return {
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword } = resetPasswordDto;
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return {
          msg: 'Có lỗi xảy ra!',
          status: false,
        };
      }
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExquires = undefined;
      await user.save();
      return {
        msg: 'Reset mật khẩu thành công.',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async countUsers() {
    try {
      const countUsers = await this.userModel.countDocuments({
        role: { $ne: 'admin' },
      });
      return {
        status: true,
        countUsers,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async changeRoleForUser(changeRoleDto: ChangeRoleDto) {
    const { userId, role } = changeRoleDto;
    try {
      await this.userModel.findByIdAndUpdate(
        userId,
        {
          role,
        },
        { new: true },
      );
      return {
        msg: 'Cập nhật vai trò người dùng thành công.',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
