import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../user/admin.guard';
import { CategoryIdDto } from './dto/categoryId.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Request } from 'express';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/create-category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Post('/get-a-category')
  getACategory(@Body() categoryIdDto: CategoryIdDto) {
    return this.categoryService.getACategory(categoryIdDto);
  }

  @Post('/get-all-categories')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/update-category')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-a-category')
  deleteACategory(@Body() categoryIdDto: CategoryIdDto) {
    return this.categoryService.deleteACategory(categoryIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-many-categories')
  deleteManyCategories(@Req() req: Request) {
    return this.categoryService.deleteManyCategories(req);
  }
}
