import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Request } from 'express';
import { Product } from '../product/product.schema';
import { statusDeliveryEnum, statusOrderEnum } from '../utils/variableGlobal';
import RequestWithRawBody from '../utils/stripe/requestWithRawBody.interface';
import { Cart } from '../cart/cart.schema';
import { CartIdDto } from '../cart/dto/cartId.dto';
import { Coupon } from '../coupon/coupon.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, req: Request) {
    const userId = req['user']._id;
    const { addressId, couponId, orderItems } = createOrderDto;
    const totalPrice = orderItems.reduce(
      (total, item) => total + parseInt(item.quantity) * parseInt(item.price),
      0,
    );
    try {
      //delete các order đang ở trạng thái chờ của user để cập nhật cái order pending mới
      await this.orderModel.deleteMany({
        user: userId,
        status: statusOrderEnum.pending,
      });
      const createOrder = await this.orderModel.create({
        user: userId,
        address: addressId,
        coupon: couponId,
        orderItems,
        totalPrice: totalPrice.toString(),
      });
      for (const item of orderItems) {
        const { productId, variantId, quantity, cartId } = item;
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

        // Tìm và cập nhật orderId cho các carts
        await this.cartModel.findByIdAndUpdate(
          cartId,
          {
            orderId: createOrder._id,
            status_delivery: statusDeliveryEnum.notPaymentDone,
            sellerId: findProduct.seller,
          },
          {
            new: true,
          },
        );
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

  async getAllOrdersByUser(req: Request) {
    const userId = req['user']._id;
    const keySearch: string = req.query?.s?.toString();
    const currentPage: number = req.query.page as any;
    const itemsPerPage: number = req.query.limit as any;
    try {
      const options: any = {
        user: userId,
      };
      if (keySearch) {
        options.$or = [{ status: new RegExp(keySearch, 'i') }];
      }
      const allOrders = await this.orderModel
        .find(options)
        .sort({ createdAt: -1 });
      const page: number = currentPage || 1;
      const limit: number = itemsPerPage || 10;
      const skip: number = (page - 1) * limit;

      const totalOrders = await this.orderModel.countDocuments(options);
      const data = allOrders.slice(
        skip,
        parseInt(skip.toString()) + parseInt(limit.toString()),
      );
      return {
        status: true,
        data: data,
        totalOrders,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserOrderPending(req: Request) {
    const userId = req['user']._id;
    try {
      let order: any = await this.orderModel.findOne({
        user: userId,
        status: statusOrderEnum.pending,
      });
      if (!order) {
        return {
          msg: 'Không tìm thấy order ở trạng thái pending của người dùng này.',
          status: false,
        };
      }
      const detailProductsPromise = order.orderItems.map(async (item: any) => {
        const product = await this.productModel.findById(item.productId);
        return product;
      });
      const detailProducts = await Promise.all(detailProductsPromise);
      const detailVariants = detailProducts.flatMap((product) => {
        return product.variants.map((variant: any) => {
          const variantJson = JSON.stringify(variant);
          const plainVariant = JSON.parse(variantJson);
          const variantBonus = {
            ...plainVariant,
            name: product.name,
          };
          return variantBonus;
        });
      });

      const getVariants = detailVariants.flatMap((variant) => {
        return order.orderItems.map((item: any) => {
          if (item.variantId.toString() === variant._id.toString()) {
            return {
              cartId: item.cartId,
              productId: item.productId,
              variantId: item.variantId,
              name: variant.name,
              price: variant.price,
              image: variant.image,
              color: variant.color,
              quantity: item.quantity,
            };
          }
        });
      });
      const newGetVariants = getVariants.filter((item) => item !== undefined);
      const uniqueItemsSet = new Set();
      const uniqueVariants = [];

      for (const item of newGetVariants) {
        const key = JSON.stringify([item.productId, item.variantId]);
        if (!uniqueItemsSet.has(key)) {
          uniqueItemsSet.add(key);
          uniqueVariants.push(item);
        }
      }

      const orderJson = JSON.stringify(order);
      const plainOrder = JSON.parse(orderJson);
      order = {
        ...plainOrder,
        orderItems: uniqueVariants,
      };

      return {
        status: true,
        order,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async paymentOrder(req: RequestWithRawBody) {
    //add product to Stripe to prepare payment online
    try {
      const lineItems: any = [];
      const order = (await this.getUserOrderPending(req)).order;
      const products = order.orderItems;

      for (const item of products) {
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

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const stripeWithSecretKey = require('stripe')(
        process.env.STRIPE_SECRET_KEY ?? '',
      );
      const promises = products.map(async (item: any) => {
        const product = await stripeWithSecretKey.products.create({
          name: item.name,
        });
        const price = await stripeWithSecretKey.prices.create({
          product: product.id,
          unit_amount: parseFloat(item.price),
          currency: 'vnd',
        });
        lineItems.push({
          price: price.id,
          quantity: parseInt(item.quantity),
        });
      });
      await Promise.all(promises);

      const session = await stripeWithSecretKey.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/buyer',
        cancel_url: 'http://localhost:3000/buyer',
      });
      await this.orderModel.findByIdAndUpdate(
        order._id,
        {
          session_id: session.id,
        },
        {
          new: true,
        },
      );
      await this.couponModel.findByIdAndDelete(order.coupon);
      return {
        url: session.url,
        session_id: session.id,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getWebhookStripe(req: RequestWithRawBody) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const stripeWithSecretKey = require('stripe')(
        process.env.STRIPE_SECRET_KEY ?? '',
      );
      const endpointSecret = process.env.ENDPOINT_SECRET;
      const sig = req.headers['stripe-signature'];

      const event = stripeWithSecretKey.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret,
      );

      // Handle the events
      switch (event.type) {
        case 'checkout.session.completed':
          const invoice = event.data.object;
          const currentOrder = await this.orderModel.findOne({
            session_id: invoice.id,
          });
          currentOrder.status = statusOrderEnum.done;
          currentOrder.payment_intent_id = invoice.payment_intent;
          await currentOrder.save();

          const cartIds = currentOrder.orderItems.map((item) => item.cartId);
          await this.cartModel.updateMany(
            {
              _id: { $in: cartIds },
            },
            {
              $set: {
                status_delivery: statusDeliveryEnum.notShippedYet,
              },
            },
            {
              new: true,
            },
          );
          break;
        case 'checkout.session.expired':
          console.log('Phiên giao dịch đã hết hạn.');
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async cancelOrder(cartIdDto: CartIdDto) {
    const { cartId } = cartIdDto;
    try {
      const cart = await this.cartModel.findById(cartId);

      if (cart.status_delivery !== statusDeliveryEnum.notShippedYet) {
        return {
          msg: 'Đơn hàng này không thể hủy.',
          status: false,
        };
      }
      const orderId = cart.orderId;
      await this.cartModel.updateMany(
        { orderId },
        {
          $set: {
            status_delivery: statusDeliveryEnum.cancel,
          },
        },
        {
          new: true,
        },
      );
      const order = await this.orderModel.findById(orderId);
      const orderItems = order.orderItems;

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
          parseInt(findVariant.quantity) + parseInt(quantity)
        ).toString();
        findVariant.sold = (
          parseInt(findVariant.sold) - parseInt(quantity)
        ).toString();
        await findProduct.save();
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const stripeWithSecretKey = require('stripe')(
        process.env.STRIPE_SECRET_KEY ?? '',
      );

      const refund = await stripeWithSecretKey.refunds.create({
        payment_intent: order.payment_intent_id,
      });
      if (refund.status === 'succeeded') {
        order.status = statusOrderEnum.cancel;
        await order.save();
        return {
          msg: 'Hủy đơn hàng thành công.',
          status: true,
        };
      } else {
        return {
          msg: 'Hủy đơn hàng không thành công.',
          status: false,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllOrdersBySeller(req: Request) {
    const sellerId = req['user']._id;
    const keySearch: string = req.query?.s?.toString();
    const currentPage: number = req.query.page as any;
    const itemsPerPage: number = req.query.limit as any;
    try {
      const options: any = {
        sellerId: sellerId,
        status_delivery: {
          $in: [
            statusDeliveryEnum.notShippedYet,
            statusDeliveryEnum.shipping,
            statusDeliveryEnum.shipped,
            statusDeliveryEnum.cancel,
          ],
        },
      };
      if (keySearch) {
        options.$or = [{ status_delivery: new RegExp(keySearch, 'i') }];
      }
      const orders: any = await this.cartModel
        .find(options)
        .populate('userId')
        .populate('productId')
        .sort({ createdAt: -1 });

      const page: number = currentPage || 1;
      const limit: number = itemsPerPage || 10;
      const skip: number = (page - 1) * limit;

      const totalOrders = await this.cartModel.countDocuments(options);
      const data = orders.slice(
        skip,
        parseInt(skip.toString()) + parseInt(limit.toString()),
      );

      const findVariants = data.map((order: any) => {
        const variant = order.productId.variants.find(
          (item: any) => item._id.toString() === order.variantId.toString(),
        );

        return {
          cartId: order._id,
          image: variant.image,
          sold: variant.sold,
          color: variant.color,
          price: variant.price,
          quantity: order.quantity,
          status_delivery: order.status_delivery,
          buyername: order.userId.username,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });
      return {
        status: true,
        orders: findVariants,
        totalOrders,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
