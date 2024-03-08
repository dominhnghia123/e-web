import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}
}
