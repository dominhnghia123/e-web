import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponIdDto } from './dto/couponId.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AdminGuard } from '../user/admin.guard';
import { Request } from 'express';
import { UserGuard } from '../user/user.guard';

@ApiTags('Coupon')
@Controller('api/coupon')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/create-coupon')
  createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-a-coupon')
  getACoupon(@Body() couponIdDto: CouponIdDto, @Req() req: Request) {
    return this.couponService.getACoupon(couponIdDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-coupons-by-user')
  getCouponsByUser(@Req() req: Request) {
    return this.couponService.getCouponsByUser(req);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/get-all-coupons')
  getAllCoupons(@Req() req: Request) {
    return this.couponService.getAllCoupons(req);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/update-coupon')
  updateCoupon(@Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.updateCoupon(updateCouponDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-a-coupon')
  deleteACoupon(@Body() couponIdDto: CouponIdDto) {
    return this.couponService.deleteACoupon(couponIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-many-coupons')
  deleteManyCoupons(@Req() req: Request) {
    return this.couponService.deleteManyCoupons(req);
  }
}
