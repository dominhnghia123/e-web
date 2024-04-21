import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressIdDto } from './dto/addressId.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor(@InjectModel(Address.name) private addressModel: Model<Address>) { }

    async createAddress(createAddressDto: CreateAddressDto) {
        const { username, phone, address } = createAddressDto;
        try {
            const newAddress = await this.addressModel.create({
                username: username,
                phone: phone,
                address: address
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

    async getAnAddress(addressIdDto: AddressIdDto) {
        const { _id } = addressIdDto;
        try {
            const address = await this.addressModel.findById(_id);
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

    async getAllAddress() {
        try {
            const allAddresses = await this.addressModel.find().sort({ title: 'asc' });
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

    async updateAddress(updateAddressDto: UpdateAddressDto) {
        const { _id, username, phone, address } = updateAddressDto;
        try {
            const findAddress = await this.addressModel.findById(_id);
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
                    address: address
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

    async deleteAnAddress(addressIdDto: AddressIdDto) {
        const { _id } = addressIdDto;
        try {
            const findAddress = await this.addressModel.findById(_id);
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
