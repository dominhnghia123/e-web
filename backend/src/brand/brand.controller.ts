import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandIdDto } from './dto/brandId.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AdminGuard } from '../user/admin.guard';
import { Request } from 'express';

@ApiTags('Brand')
@Controller('api/brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/create-brand')
  createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.createBrand(createBrandDto);
  }

  @Post('/get-a-brand')
  getABrand(@Body() brandIdDto: BrandIdDto) {
    return this.brandService.getABrand(brandIdDto);
  }

  @Post('/get-all-brands')
  getAllBrands() {
    return this.brandService.getAllBrands();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/update-brand')
  updateBrand(@Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.updateBrand(updateBrandDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-a-brand')
  deleteABrand(@Body() brandIdDto: BrandIdDto) {
    return this.brandService.deleteABrand(brandIdDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('/delete-many-brands')
  deleteManyBrands(@Req() req: Request) {
    return this.brandService.deleteManyBrands(req);
  }
}
