import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Request } from 'express';
import { Product } from '../product/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, req: Request) {
    const userId = req['user']._id;
    const { shippingInfo, orderItems, status } = createOrderDto;
    const totalPrice = orderItems.reduce(
      (total, item) => total + parseInt(item.quantity) * parseInt(item.price),
      0,
    );
    try {
      const createOrder = await this.orderModel.create({
        user: userId,
        shippingInfo,
        orderItems,
        totalPrice: totalPrice.toString(),
        paidAt: new Date().toISOString(),
        status,
      });
      for (const item of orderItems) {
        const { productId, variantId, quantity } = item;

        // Tìm và cập nhật thông tin sản phẩm
        const findProduct = await this.productModel.findById(productId);
        if (!findProduct) {
          throw new BadRequestException(
            `Product with ID ${productId} not found`,
          );
        }
        const findVariant = findProduct.variants.find(
          (variant) => variant._id.toString() === variantId.toString(),
        );
        if (!findVariant) {
          throw new BadRequestException(
            `Variant with ID ${variantId} not found`,
          );
        }
        findVariant.quantity = (
          parseInt(findVariant.quantity) - parseInt(quantity)
        ).toString();
        findVariant.sold = (
          parseInt(findVariant.sold) + parseInt(quantity)
        ).toString();
        await findProduct.save();
      }
      return {
        msg: 'Tạo đơn hàng thành công.',
        status: true,
        createOrder,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
