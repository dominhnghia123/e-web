import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestSellerService } from './requestSeller.service';
import { UserGuard } from '../user/user.guard';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { Request } from 'express';
import { AdminGuard } from '../user/admin.guard';
import { UserIdDto } from '../user/dto/userId.dto';

@ApiTags('RequestSeller')
@Controller('api/requestSeller')
export class RequestSellerController {
    constructor(private requestSellerService: RequestSellerService) { }

    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post('/send-request-become-seller')
    sendRequestBecomeSeller(@Body() registerSellerDto: RegisterSellerDto, @Req() req: Request) {
        return this.requestSellerService.sendRequestBecomeSeller(registerSellerDto, req);
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post('/accept-request-become-seller')
    acceptRequestBecomeSeller(@Body() userIdDto: UserIdDto) {
        return this.requestSellerService.acceptRequestBecomeSeller(userIdDto);
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post('/refuse-request-become-seller')
    refuseRequestBecomeSeller(@Body() userIdDto: UserIdDto) {
        return this.requestSellerService.refuseRequestBecomeSeller(userIdDto);
    }
}
