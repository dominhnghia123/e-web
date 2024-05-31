import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { AddToCartDto } from './dto/addToCart.dto';
import { Request } from 'express';
import { Product } from '../product/product.schema';
import { RemoveProductDto } from './dto/removeProduct.dto';
import { ChangeQuantityProductDto } from './dto/changeQuantityProduct.dto';
import { User } from '../user/user.schema';
import { statusDeliveryEnum } from '../utils/variableGlobal';
import { UpdateStatusDeliveryCartDto } from './dto/updateStatusDeliveryCart.dto';
import { StatusCartDto } from './dto/statusCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addToCart(addToCartDto: AddToCartDto, req: Request) {
    const { productId, variantId, quantity } = addToCartDto;
    const userId = req['user']._id;

    try {
      const findProduct = await this.productModel.findById(productId);
      const findVariant = findProduct.variants.find(
        (variant) => variant._id.toString() === variantId.toString(),
      );
      const checkAlreadyCart = await this.cartModel.findOne({
        userId,
        productId,
        variantId,
      });
      if (
        checkAlreadyCart.status_delivery === statusDeliveryEnum.notOrderedYet
      ) {
        return {
          msg: 'Sản phẩm này đã tồn tại trong giỏ hàng.',
          status: false,
        };
      }
      if (
        checkAlreadyCart.status_delivery === statusDeliveryEnum.notPaymentDone
      ) {
        return {
          msg: 'Sản phẩm này đã được chọn mua và được chờ thanh toán.',
          status: false,
        };
      }
      const newCart = await this.cartModel.create({
        userId,
        productId,
        variantId,
        quantity,
        price: findVariant.price,
      });

      const user = await this.userModel.findById({ _id: userId });
      user.cart.push(newCart._id.toString());
      await user.save();

      return {
        msg: 'Đã thêm vào giỏ hàng.',
        status: true,
        newCart,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeProductFromCart(
    removeProductDto: RemoveProductDto,
    req: Request,
  ) {
    const { cartId } = removeProductDto;
    const userId = req['user']._id;
    try {
      const deletedProduct = await this.cartModel.findOneAndDelete({
        userId,
        _id: cartId,
      });
      if (!deletedProduct) {
        return {
          msg: 'Không tồn tại sản phẩm này',
          status: false,
        };
      }

      const user = await this.userModel.findById({ _id: userId });
      user.cart = user.cart.filter((item) => item !== cartId);
      await user.save();

      return {
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateStatusDeliveryManyProductsFromCart(req: Request) {
    const { cartIds } = req.body;
    const userId = req['user']._id;
    try {
      const updatedProducts = await this.cartModel.updateMany(
        {
          userId,
          _id: { $in: cartIds },
        },
        {
          $set: {
            status_delivery: statusDeliveryEnum.notPaymentDone,
          },
        },
        {
          new: true,
        },
      );
      if (!updatedProducts) {
        return {
          msg: 'Không tồn tại những sản phẩm này',
          status: false,
        };
      }

      const user = await this.userModel.findById({ _id: userId });
      user.cart = user.cart.filter((item) => !cartIds.includes(item));
      await user.save();

      return {
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCartNotOrderedYet(req: Request) {
    const userId = req['user']._id;
    try {
      const getUserCart = await this.cartModel
        .find({ userId, status_delivery: statusDeliveryEnum.notOrderedYet })
        .populate('productId');
      const getVariants = getUserCart.flatMap((item) => {
        return item.productId.variants.map((variant) => {
          if (variant._id.toString() === item.variantId.toString()) {
            return {
              cartId: item._id,
              productId: item.productId._id,
              variantId: variant._id,
              name: item.productId.name,
              price: variant.price,
              image: variant.image,
              color: variant.color,
              quantity: item.quantity,
              sold: variant.sold,
              inventory_quantity: variant.quantity,
            };
          }
        });
      });
      const variantDetail = getVariants.filter((item) => item);

      return {
        status: true,
        variantDetail,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCartsById(req: Request) {
    const { cartIds } = req.body;
    try {
      const getCarts = await this.cartModel
        .find({ _id: { $in: cartIds } })
        .populate('productId');
      const getVariants = getCarts.flatMap((item) => {
        return item.productId.variants.map((variant) => {
          if (variant._id.toString() === item.variantId.toString()) {
            return {
              cartId: item._id,
              productId: item.productId._id,
              variantId: variant._id,
              name: item.productId.name,
              price: variant.price,
              image: variant.image,
              color: variant.color,
              quantity: item.quantity,
              sold: variant.sold,
              inventory_quantity: variant.quantity,
            };
          }
        });
      });
      const variantDetail = getVariants.filter((item) => item);
      return {
        status: true,
        products: variantDetail,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async changeQuantityProductInCart(
    changeQuantityProductDto: ChangeQuantityProductDto,
    req: Request,
  ) {
    const { cartId, newQuantity } = changeQuantityProductDto;
    const userId = req['user']._id;
    try {
      const updateQuantity = await this.cartModel.findOneAndUpdate(
        { userId, _id: cartId },
        {
          quantity: newQuantity,
        },
        {
          new: true,
        },
      );
      return {
        status: true,
        updateQuantity,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateStatusDeliveryCart(
    updateStatusDeliveryCartDto: UpdateStatusDeliveryCartDto,
    req: Request,
  ) {
    const { cartId, status } = updateStatusDeliveryCartDto;
    const user = req['user'];
    try {
      const cart = await this.cartModel.findById(cartId).populate('productId');
      const seller = await this.userModel.findById(cart.productId.seller);
      if (seller._id.toString() !== user._id.toString()) {
        return {
          msg: 'Bạn không có quyền cập nhật trạng thái của đơn hàng này.',
          status: false,
        };
      }
      cart.status_delivery = status;
      await cart.save();
      return {
        msg: 'Cập nhật trạng thái đơn hàng thành công.',
        status: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCartsByStatus(statusCart: StatusCartDto, req: Request) {
    const { status } = statusCart;
    const userId = req['user']._id;
    try {
      let carts = [];
      if (status) {
        carts = await this.cartModel
          .find({ userId, status_delivery: status })
          .populate('productId');
      } else {
        carts = await this.cartModel
          .find({
            userId,
            status_delivery: { $ne: statusDeliveryEnum.notOrderedYet },
          })
          .populate('productId');
      }
      const getVariants = carts.flatMap((item) => {
        return item.productId.variants.map((variant: any) => {
          if (variant._id.toString() === item.variantId.toString()) {
            return {
              cartId: item._id,
              productId: item.productId._id,
              variantId: variant._id,
              name: item.productId.name,
              price: variant.price,
              image: variant.image,
              color: variant.color,
              quantity: item.quantity,
              sold: variant.sold,
              inventory_quantity: variant.quantity,
              status_delivery: item.status_delivery,
            };
          }
        });
      });
      const variantDetail = getVariants.filter((item) => item);

      return {
        status: true,
        variantDetail,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
