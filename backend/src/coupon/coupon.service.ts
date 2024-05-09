import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponIdDto } from './dto/couponId.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Request } from 'express';
import { User } from '../user/user.schema';

@Injectable()
export class CouponService {
    constructor(
        @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async createCoupon(createCouponDto: CreateCouponDto) {
        const { userId, name, expiry, discount } = createCouponDto;
        try {
            const checkExistUser = await this.userModel.findById(userId);
            if (!checkExistUser) {
                return {
                    msg: 'Người dùng này không tồn tại!',
                    status: false
                }
            }
            const newCoupon = await this.couponModel.create({
                userId: userId,
                name: name,
                expiry: expiry,
                discount: discount,
            });

            const user = await this.userModel.findById({ _id: userId });
            user.coupons.push(newCoupon._id.toString());
            await user.save();

            return {
                msg: 'Tạo khuyến mãi thành công',
                status: true,
                newCoupon: newCoupon,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getACoupon(couponIdDto: CouponIdDto, req: Request) {
        const { _id } = couponIdDto;
        try {
            const coupon = await this.couponModel.findOne({ _id });
            if (!coupon) {
                return {
                    msg: 'Gói khuyến mãi này không tồn tại',
                    status: false,
                };
            }
            return {
                status: true,
                coupon: coupon,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getCouponsByUser(req: Request) {
        const userId = req['user']._id
        try {
            const allCoupons = await this.couponModel.find({ userId }).sort({ createdAt: 1 });
            return {
                status: true,
                allCoupons: allCoupons,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getAllCoupons(req: Request) {
        const keySearch: string = req.query?.s?.toString()
        const currentPage: number = req.query.page as any
        const itemsPerPage: number = req.query.limit as any
        try {
            let options = {};

            if (keySearch) {
                options = { name: new RegExp(keySearch, 'i') }
            }
            const allCoupons = await this.couponModel.find(options).sort({ createdAt: -1 }).populate("userId")
            const page: number = currentPage || 1
            const limit: number = itemsPerPage || 10
            const skip: number = (page - 1) * limit

            const totalCoupons = await this.couponModel.countDocuments(options)
            const data = allCoupons.slice(skip, parseInt(skip.toString()) + parseInt(limit.toString()))
            return {
                status: true,
                coupons: data,
                totalCoupons,
                page,
                limit,
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async updateCoupon(updateCouponDto: UpdateCouponDto) {
        const { _id, userId, name, expiry, discount } = updateCouponDto;
        try {
            const findCoupon = await this.couponModel.findById(_id);
            if (!findCoupon) {
                return {
                    msg: 'Mã khuyến mãi không tồn tại',
                    status: false,
                };
            }

            const updatedCoupon = await this.couponModel.findByIdAndUpdate(
                _id,
                {
                    userId: userId,
                    name: name,
                    expiry: expiry,
                    discount: discount,
                },
                {
                    new: true,
                },
            );

            return {
                msg: 'Cập nhật gói khuyến mãi thành công',
                status: true,
                updatedCoupon: updatedCoupon,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteACoupon(couponIdDto: CouponIdDto) {
        const { _id } = couponIdDto;
        try {
            const findCoupon = await this.couponModel.findById(_id);
            if (!findCoupon) {
                return {
                    msg: 'Gói khuyến mãi này không tồn tại.',
                    status: false,
                };
            }

            const deletedCoupon = await this.couponModel.findByIdAndDelete(_id);
            return {
                msg: 'Xóa gói khuyến mãi thành công.',
                status: true,
                deletedCoupon: deletedCoupon,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteManyCoupons(req: Request) {
        const { couponIds } = req.body;
        try {
            const deletedManyCoupons = await this.couponModel.deleteMany({
                _id: { $in: couponIds },
            });

            return {
                msg: 'Xóa các gói khuyến mãi thành công.',
                status: true,
                deletedManyCoupons: deletedManyCoupons,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
