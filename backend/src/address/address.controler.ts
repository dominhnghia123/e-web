import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressIdDto } from './dto/addressId.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressService } from './address.service';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';

@ApiTags('Address')
@Controller('api/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/create-address')
  createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Req() req: Request,
  ) {
    return this.addressService.createAddress(createAddressDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-an-address')
  getAnAddress(@Body() addressIdDto: AddressIdDto, @Req() req: Request) {
    return this.addressService.getAnAddress(addressIdDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-all-address')
  getAllAddress(@Req() req: Request) {
    return this.addressService.getAllAddress(req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-address')
  updateAddress(
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    return this.addressService.updateAddress(updateAddressDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/delete-a-address')
  deleteAnAddress(@Body() addressIdDto: AddressIdDto, @Req() req: Request) {
    return this.addressService.deleteAnAddress(addressIdDto, req);
  }
}
