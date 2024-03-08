import { Controller } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('api/brand')
export class BrandController {
  constructor(private brandService: BrandService) {}
}
