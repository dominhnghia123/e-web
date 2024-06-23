import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandIdDto } from './dto/brandId.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Request } from 'express';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async createBrand(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;

    try {
      const alreadyBrand = await this.brandModel.findOne({ name: name });
      if (alreadyBrand) {
        return {
          msg: 'This brand already exists',
          status: false,
        };
      }

      const newBrand = await this.brandModel.create({
        name: name,
      });

      return {
        msg: 'Created brand successfully',
        status: true,
        newBrand: newBrand,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getABrand(brandIdDto: BrandIdDto) {
    const { _id } = brandIdDto;
    try {
      const brand = await this.brandModel.findById(_id);
      if (!brand) {
        return {
          msg: 'This brand is not exists',
          status: false,
        };
      }
      return {
        msg: 'Found brand successfully',
        status: true,
        brand: brand,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllBrands(req: Request) {
    const keySearch: string = req.query?.s?.toString();
    const currentPage: number = req.query.page as any;
    const itemsPerPage: number = req.query.limit as any;
    try {
      let options = {};

      if (keySearch) {
        options = { name: new RegExp(keySearch, 'i') };
      }
      const allBrands = await this.brandModel
        .find(options)
        .sort({ createdAt: -1 });
      const page: number = currentPage || 1;
      const limit: number = itemsPerPage || 10;
      const skip: number = (page - 1) * limit;

      const totalBrands = await this.brandModel.countDocuments(options);
      const data = allBrands.slice(
        skip,
        parseInt(skip.toString()) + parseInt(limit.toString()),
      );
      return {
        status: true,
        brands: data,
        totalBrands,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateBrand(updateBrandDto: UpdateBrandDto) {
    const { _id, name } = updateBrandDto;
    try {
      const findBrand = await this.brandModel.findById(_id);
      if (!findBrand) {
        return {
          msg: 'This brand not exists',
          status: false,
        };
      }

      const updatedBrand = await this.brandModel.findByIdAndUpdate(
        _id,
        {
          name: name,
        },
        {
          new: true,
        },
      );

      return {
        msg: 'Updated brand successfully',
        status: true,
        updatedBrand: updatedBrand,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteABrand(brandIdDto: BrandIdDto) {
    const { _id } = brandIdDto;
    try {
      const findBrand = await this.brandModel.findById(_id);
      if (!findBrand) {
        return {
          msg: 'This brand is not exist',
          status: false,
        };
      }

      const deletedBrand = await this.brandModel.findByIdAndDelete(_id);
      return {
        msg: 'Deleted brand successfully',
        status: true,
        deletedBrand: deletedBrand,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteManyBrands(req: Request) {
    const { brandIds } = req.body;
    try {
      const deletedManyBrands = await this.brandModel.deleteMany({
        _id: { $in: brandIds },
      });

      return {
        msg: 'Deleted brands successfully',
        status: true,
        deletedManyBrands: deletedManyBrands,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
