import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../user/user.schema';
import { RequestSeller } from './requestSeller.schema';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { Request } from 'express';
import { statusRequestSellerEnum } from '../utils/variableGlobal';
import { UserIdDto } from '../user/dto/userId.dto';

@Injectable()
export class RequestSellerService {
    constructor(
        @InjectModel(RequestSeller.name) private requestSellerModel: Model<RequestSeller>,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async sendRequestBecomeSeller(registerSellerDto: RegisterSellerDto, req: Request) {
        const { shopName, addressGetGoods, cccd, fullName } = registerSellerDto;
        const { _id, isSeller } = req['user']
        try {
            if (isSeller) {
                return {
                    msg: 'Bạn đã là người bán của Shopify rồi.',
                    status: false
                }
            }
            const existsRequest = await this.requestSellerModel.findOne({
                userId: _id, status: statusRequestSellerEnum.pending
            })
            if (existsRequest) {
                return {
                    msg: 'Yêu cầu đã được gửi, chúng tôi sẽ sớm phản hồi yêu cầu của bạn.',
                    status: false
                }
            }
            const newRequest = await this.requestSellerModel.create({
                userId: _id,
                shopName,
                addressGetGoods,
                cccd,
                fullName
            });
            return {
                msg: 'Gửi yêu cầu thành công',
                status: true,
                newRequest
            }

        } catch (error) {
            throw new BadRequestException(error)
        }

    }

    async acceptRequestBecomeSeller(userIdDto: UserIdDto) {
        const { _id } = userIdDto;
        try {
            const findRequest = await this.requestSellerModel.findOne({ userId: _id });
            if (!findRequest) {
                return {
                    msg: 'Yêu cầu này đã bị xóa hoặc không tồn tại',
                    status: false
                }
            }
            findRequest.status = statusRequestSellerEnum.accept;
            await findRequest.save();
            await this.userModel.findByIdAndUpdate(
                _id,
                {
                    isSeller: true
                },
                {
                    new: true
                }
            )
            return {
                msg: 'Đã chấp nhận yêu cầu',
                status: true
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async refuseRequestBecomeSeller(userIdDto: UserIdDto) {
        const { _id } = userIdDto;
        try {
            const findRequest = await this.requestSellerModel.findOne({ userId: _id });
            if (!findRequest) {
                return {
                    msg: 'Yêu cầu này đã bị xóa hoặc không tồn tại',
                    status: false
                }
            }
            findRequest.status = statusRequestSellerEnum.refuse;
            await findRequest.save();
            await this.userModel.findByIdAndUpdate(
                _id,
                {
                    isSeller: false
                },
                {
                    new: true
                }
            )
            return {
                msg: 'Đã từ chối yêu cầu',
                status: true
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
