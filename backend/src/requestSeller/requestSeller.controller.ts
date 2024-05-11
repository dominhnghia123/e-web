import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestSellerService } from './requestSeller.service';
import { UserGuard } from '../user/user.guard';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { Request } from 'express';
import { AdminGuard } from '../user/admin.guard';
import { RequestIdDto } from './dto/requestId.dto';

@ApiTags('RequestSeller')
@Controller('api/requestSeller')
export class RequestSellerController {
  constructor(private requestSellerService: RequestSellerService) {}

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/send-request-become-seller')
  sendRequestBecomeSeller(
    @Body() registerSellerDto: RegisterSellerDto,
    @Req() req: Request,
  ) {
    return this.requestSellerService.sendRequestBecomeSeller(
      registerSellerDto,
      req,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/accept-request-become-seller')
  acceptRequestBecomeSeller(@Body() requestIdDto: RequestIdDto) {
    return this.requestSellerService.acceptRequestBecomeSeller(requestIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/refuse-request-become-seller')
  refuseRequestBecomeSeller(@Body() requestIdDto: RequestIdDto) {
    return this.requestSellerService.refuseRequestBecomeSeller(requestIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/get-requests-become-seller')
  getRequestsBecomeSeller() {
    return this.requestSellerService.getRequestsBecomeSeller();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/get-detail-request')
  getDetailRequest(@Body() requestDtoId: RequestIdDto) {
    return this.requestSellerService.getDetailRequest(requestDtoId);
  }
}
