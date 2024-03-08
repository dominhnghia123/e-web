import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('brand')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
}
