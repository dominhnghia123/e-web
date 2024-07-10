import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandIdDto } from './dto/brandId.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Request } from 'express';
import slugify from 'slugify';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async createBrand(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;

    try {
      const alreadyBrand = await this.brandModel.findOne({ name: name });
      if (alreadyBrand) {
        return {
          msg: 'Thương hiệu này đã tồn tại',
          status: false,
        };
      }

      const newBrand = await this.brandModel.create({
        name: name,
      });

      return {
        msg: 'Tạo thành công.',
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
          msg: 'Thương hiệu này không tồn tại',
          status: false,
        };
      }
      return {
        status: true,
        brand: brand,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllBrands() {
    try {
      const brands = await this.brandModel.find();
      const alterBrands = brands.map((brand) => {
        return {
          ...JSON.parse(JSON.stringify(brand)),
          url: slugify(brand.name.toLowerCase()),
        };
      });
      return {
        status: true,
        brands: alterBrands,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateBrand(updateBrandDto: UpdateBrandDto) {
    const { _id, name } = updateBrandDto;
    try {
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
        msg: 'Cập nhật thành công.',
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
      await this.brandModel.findByIdAndDelete(_id);
      return {
        msg: 'Xóa thành công.',
        status: true,
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
        msg: 'Xóa thành công',
        status: true,
        deletedManyBrands: deletedManyBrands,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
