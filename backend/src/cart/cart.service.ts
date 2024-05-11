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
      if (checkAlreadyCart) {
        return {
          msg: 'Sản phẩm này đã tồn tại trong giỏ hàng.',
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
      await this.cartModel.findOneAndDelete({ userId, _id: cartId });

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

  async getCart(req: Request) {
    const userId = req['user']._id;
    try {
      const getUserCart = await this.cartModel
        .find({ userId })
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
}
