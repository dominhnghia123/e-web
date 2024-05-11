import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressIdDto } from './dto/addressId.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressService } from './address.service';
import { UserGuard } from '../user/user.guard';

@ApiTags('Address')
@Controller('api/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/create-address')
  createAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.createAddress(createAddressDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-an-address')
  getAnAddress(@Body() addressIdDto: AddressIdDto) {
    return this.addressService.getAnAddress(addressIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/get-all-address')
  getAllAddress() {
    return this.addressService.getAllAddress();
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/update-address')
  updateAddress(@Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.updateAddress(updateAddressDto);
  }

  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/delete-a-address')
  deleteAnAddress(@Body() addressIdDto: AddressIdDto) {
    return this.addressService.deleteAnAddress(addressIdDto);
  }
}
