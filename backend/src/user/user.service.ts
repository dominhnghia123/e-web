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
import { Product } from '../product/product.schema';
import { PhoneNumberDto } from './dto/phoneNumber.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private jwtService: JwtService,
  ) { }

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

      return {
        msg: 'Đăng ký thành công!',
        status: true,
        newUser: newUser,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async registerSeller(registerUserDto: RegisterUserDto) {
    const { username, email, password, mobile } = registerUserDto;
    try {
      const alreadyUser = await this.userModel.findOne({
        $or: [{ username: username }, { email: email }, { mobile: mobile }],
      });
      if (alreadyUser) {
        if (alreadyUser.isSeller === true) {
          return {
            msg: 'Người dùng này đã là người bán',
            status: false,
          };
        }
        alreadyUser.isSeller = true;
        await alreadyUser.save();
      } else {
        if (mobile.length != 10) {
          return {
            property: 'mobile',
            msg: 'Số điện thoại không hợp lệ.',
            status: false,
          };
        }

        await this.userModel.create({
          username: username,
          email: email,
          password: password,
          mobile: mobile,
          isSeller: true,
        });
      }

      return {
        msg: 'Đăng ký trở thành người bán Shopify thành công.',
        status: true,
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
        console.log("password sai!");
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
          followers: findUser?.followers,
          numFollows: findUser?.numFollows,
          isFollowed: findUser?.isFollowed,
          cart: findUser?.cart,
          wishlist: findUser?.wishlist,
          warehouses: findUser?.warehouses,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await this.userModel.find().sort({ username: 'asc' });
      if (allUsers.length > 0) {
        return {
          msg: 'All users were found successfully',
          status: true,
          allUsers: allUsers,
        };
      } else {
        return {
          msg: 'No users exist in the database',
          status: true,
        };
      }
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
          msg: 'Current password is incorrectly',
          status: false,
        };
      }
      if (newPassword !== '' && newPassword.length < 4) {
        return {
          msg: 'Password should be least 4 characters',
          status: false,
        };
      }

      if (currentPassword === newPassword) {
        return {
          msg: 'The old and new passwords must be different',
          status: false,
        };
      }
      if (newPassword !== confirmPassword) {
        return {
          msg: 'The new password and confirmation password must be the same',
          status: false,
        };
      }
      user.password = newPassword;
      await user.save();
      return {
        msg: 'Changed password successfully',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkAlreadyPhoneNumber(phoneNumberDto: PhoneNumberDto) {
    const { mobile } = phoneNumberDto
    try {
      const checkAlreadyPhoneNumber = await this.userModel.findOne({ mobile });
      if (checkAlreadyPhoneNumber) {
        return {
          status: true,
        }
      }
      return {
        status: false
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
