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
import { roleUserEnum } from '../utils/variableGlobal';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserIdDto } from './dto/userId.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const { username, email, password, mobile, role } = registerUserDto;
      const findUser = await this.userModel.findOne({ email: email });
      if (findUser) {
        return {
          msg: 'This email already exists',
          status: false,
        };
      }

      if (username !== '' && username.length < 2) {
        return {
          msg: 'Username should be least 2 characters',
          status: false,
        };
      }

      if (password !== '' && password.length < 4) {
        return {
          msg: 'Password should be least 4 characters',
          status: false,
        };
      }
      if (role !== roleUserEnum.user && role !== roleUserEnum.admin) {
        return {
          msg: `Value of role must be ${roleUserEnum.user} or ${roleUserEnum.admin}`,
          status: false,
        };
      }

      const newUser = await this.userModel.create({
        username: username,
        email: email,
        password: password,
        mobile: mobile,
        role: role,
      });

      return {
        msg: 'Registered successfully',
        status: true,
        newUser: newUser,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response): Promise<any> {
    try {
      const { email, password } = loginUserDto;
      const findUser = await this.userModel.findOne({ email: email });
      if (!findUser) {
        return {
          msg: 'Not exists this email',
          status: false,
        };
      }

      if (findUser && !(await findUser.isMatchedPassword(password))) {
        return {
          msg: 'Password is incorrect',
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
        msg: 'Login successfully',
        status: true,
        currentUser: {
          _id: findUser._id,
          username: findUser.username,
          email: findUser.email,
          role: findUser.role,
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
          msg: 'Not found this user!',
          status: false,
        };
      }
      return {
        msg: 'This user was found successfully',
        status: true,
        user: {
          _id: findUser._id,
          username: findUser?.username,
          birthday: findUser?.birthday,
          address: findUser?.address,
          role: findUser?.role,
          avatar: findUser?.avatar,
          followers: findUser?.followers,
          numFollows: findUser?.numFollows,
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
    const { _id, birthday, address, avatar } = updateUserDto;
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
          address: address,
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
}
