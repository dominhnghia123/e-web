import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}
}
