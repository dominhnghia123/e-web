import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../user/user.schema';
import { RequestSeller } from './requestSeller.schema';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { Request } from 'express';
import { statusRequestSellerEnum } from '../utils/variableGlobal';
import { RequestIdDto } from './dto/requestId.dto';
import { AppService } from '../app.service';

@Injectable()
export class RequestSellerService {
  constructor(
    @InjectModel(RequestSeller.name)
    private requestSellerModel: Model<RequestSeller>,
    @InjectModel(User.name) private userModel: Model<User>,
    private appService: AppService,
  ) {}

  async sendRequestBecomeSeller(
    registerSellerDto: RegisterSellerDto,
    req: Request,
  ) {
    const { shopName, addressGetGoods, cccd, fullName } = registerSellerDto;
    const { _id, isSeller } = req['user'];
    try {
      if (isSeller) {
        return {
          msg: 'Bạn đã là người bán của Shopify rồi.',
          status: false,
        };
      }
      const existsRequest = await this.requestSellerModel.findOne({
        userId: _id,
        status: statusRequestSellerEnum.pending,
      });
      if (existsRequest) {
        return {
          msg: 'Yêu cầu đã được gửi, chúng tôi sẽ sớm phản hồi yêu cầu của bạn.',
          status: false,
        };
      }
      const newRequest = await this.requestSellerModel.create({
        userId: _id,
        shopName,
        addressGetGoods,
        cccd,
        fullName,
      });
      return {
        msg: 'Gửi yêu cầu thành công',
        status: true,
        newRequest,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async acceptRequestBecomeSeller(requestIdDto: RequestIdDto) {
    const { _id } = requestIdDto;
    try {
      const findRequest = await this.requestSellerModel
        .findById(_id)
        .populate('userId');
      if (!findRequest) {
        return {
          msg: 'Yêu cầu này đã bị xóa hoặc không tồn tại',
          status: false,
        };
      }
      const email = findRequest.userId.email;
      await findRequest.deleteOne();
      await this.userModel.findByIdAndUpdate(
        findRequest.userId,
        {
          isSeller: true,
        },
        {
          new: true,
        },
      );

      const message = `Congratulations, \nYour request to register to sell on Shopify has been accepted. Please exit the system and log back in to use the service.\nThank you for trusting and supporting us.`;

      const dataPayload = {
        to: email,
        text: message,
        subject: 'Register to seller successfully.',
      };
      await this.appService.sendEmail(dataPayload);

      return {
        msg: 'Đã chấp nhận yêu cầu',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async refuseRequestBecomeSeller(requestIdDto: RequestIdDto) {
    const { _id } = requestIdDto;
    try {
      const findRequest = await this.requestSellerModel
        .findById(_id)
        .populate('userId');
      if (!findRequest) {
        return {
          msg: 'Yêu cầu này đã bị xóa hoặc không tồn tại',
          status: false,
        };
      }
      const email = findRequest.userId.email;
      await findRequest.deleteOne();
      await this.userModel.findByIdAndUpdate(
        findRequest.userId,
        {
          isSeller: false,
        },
        {
          new: true,
        },
      );

      const message = `Notifycation: Your request to register to sell on Shopify was rejected. Please check and try again.`;

      const dataPayload = {
        to: email,
        text: message,
        subject: 'Register to seller failed.',
      };
      await this.appService.sendEmail(dataPayload);

      return {
        msg: 'Đã từ chối yêu cầu',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRequestsBecomeSeller() {
    try {
      const getRequests = await this.requestSellerModel
        .find()
        .sort({ createdAt: -1 })
        .populate('userId');
      return {
        status: true,
        getRequests,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getDetailRequest(requestDtoId: RequestIdDto) {
    const { _id } = requestDtoId;
    try {
      const request = await this.requestSellerModel
        .findById(_id)
        .populate('userId');
      return {
        status: true,
        request,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
