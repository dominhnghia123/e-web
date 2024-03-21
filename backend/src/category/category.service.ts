import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryIdDto } from './dto/categoryId.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { title } = createCategoryDto;
    try {
      const alreadyCategory = await this.categoryModel.findOne({
        title: title,
      });
      if (alreadyCategory) {
        return {
          msg: 'This category already exists',
          status: false,
        };
      }

      const newCategory = await this.categoryModel.create({
        title: title,
      });

      return {
        msg: 'Created category successfully',
        status: true,
        newCategory: newCategory,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getACategory(categoryIdDto: CategoryIdDto) {
    const { _id } = categoryIdDto;
    try {
      const category = await this.categoryModel.findById(_id);
      if (!category) {
        return {
          msg: 'This brand is not exists',
          status: false,
        };
      }
      return {
        msg: 'Found category successfully',
        status: true,
        category: category,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllCategories() {
    try {
      const allCategories = await this.categoryModel
        .find()
        .sort({ title: 'asc' });
      if (allCategories.length > 0) {
        return {
          msg: 'Found all categories successfully',
          status: true,
          allCategories: allCategories,
        };
      } else {
        return {
          msg: 'No categories exist in the database',
          status: true,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { _id, title } = updateCategoryDto;
    try {
      const findCategory = await this.categoryModel.findById(_id);
      if (!findCategory) {
        return {
          msg: 'This category not exists',
          status: false,
        };
      }

      const updatedCategory = await this.categoryModel.findByIdAndUpdate(
        _id,
        {
          title: title,
        },
        {
          new: true,
        },
      );

      return {
        msg: 'Updated category successfully',
        status: true,
        updatedCategory: updatedCategory,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteACategory(categoryIdDto: CategoryIdDto) {
    const { _id } = categoryIdDto;
    try {
      const findCategory = await this.categoryModel.findById(_id);
      if (!findCategory) {
        return {
          msg: 'This category is not exist',
          status: false,
        };
      }

      const deletedCategory = await this.categoryModel.findByIdAndDelete(_id);
      return {
        msg: 'Deleted category successfully',
        status: true,
        deletedCategory: deletedCategory,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteManyCategories(req: Request) {
    const { categoryIds } = req.body;
    try {
      const deletedManyCategories = await this.categoryModel.deleteMany({
        _id: { $in: categoryIds },
      });

      return {
        Category: 'Deleted categories successfully',
        status: true,
        deletedManyCategories: deletedManyCategories,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
