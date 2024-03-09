import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Not token at headers');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });

      const currentUser = await this.userModel.findOne({
        email: payload.email,
      });

      if (!currentUser) {
        throw new ForbiddenException('Not found user!!!');
      }

      request['user'] = {
        _id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser?.address,
        birthday: currentUser.birthday,
        role: currentUser.role,
        mobile: currentUser.mobile,
        avatar: currentUser.avatar,
        followers: currentUser.followers,
        numFollows: currentUser.numFollows,
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
