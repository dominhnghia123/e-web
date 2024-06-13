import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressIdDto } from './dto/addressId.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Request } from 'express';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async createAddress(createAddressDto: CreateAddressDto, req: Request) {
    const { username, phone, address } = createAddressDto;
    const userId = req['user']._id;
    try {
      const newAddress = await this.addressModel.create({
        userId,
        username: username,
        phone: phone,
        address: address,
      });

      return {
        msg: 'Created address successfully',
        status: true,
        newAddress: newAddress,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAnAddress(addressIdDto: AddressIdDto, req: Request) {
    const { _id } = addressIdDto;
    const userId = req['user']._id;
    try {
      const address = await this.addressModel.findOne({ _id, userId });
      if (!address) {
        return {
          msg: 'This address does not exist',
          status: false,
        };
      }
      return {
        msg: 'Found address successfully',
        status: true,
        address: address,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllAddress(req: Request) {
    const userId = req['user']._id;
    try {
      const allAddresses = await this.addressModel
        .find({ userId })
        .sort({ title: 'asc' });
      if (allAddresses.length > 0) {
        return {
          msg: 'Found all addresses successfully',
          status: true,
          allAddresses: allAddresses,
        };
      } else {
        return {
          msg: 'No addresses exist in the database',
          status: true,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateAddress(updateAddressDto: UpdateAddressDto, req: Request) {
    const { _id, username, phone, address } = updateAddressDto;
    const userId = req['user']._id;
    try {
      const findAddress = await this.addressModel.findOne({ _id, userId });
      if (!findAddress) {
        return {
          msg: 'This address does not exist',
          status: false,
        };
      }

      const updatedAddress = await this.addressModel.findByIdAndUpdate(
        _id,
        {
          username: username,
          phone: phone,
          address: address,
        },
        {
          new: true,
        },
      );

      return {
        msg: 'Updated address successfully',
        status: true,
        updatedAddress: updatedAddress,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteAnAddress(addressIdDto: AddressIdDto, req: Request) {
    const { _id } = addressIdDto;
    const userId = req['user']._id;
    try {
      const findAddress = await this.addressModel.findOne({ _id, userId });
      if (!findAddress) {
        return {
          msg: 'This address does not exist',
          status: false,
        };
      }

      const deletedAddress = await this.addressModel.findByIdAndDelete(_id);
      return {
        msg: 'Deleted address successfully',
        status: true,
        deletedAddress: deletedAddress,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
