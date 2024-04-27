import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductIdDto } from './dto/productId.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../user/user.schema';
import { BrandDto } from './dto/brand.dto';
import { brandEnum } from '../utils/variableGlobal';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async createProduct(createProductDto: CreateProductDto, req: Request) {
    const {
      name,
      slug,
      description,
      specifications,
      variants,
      brand,
      coupons,
    } = createProductDto;
    const currentUser = req['user'];
    try {
      const newProduct = await this.productModel.create({
        name: name,
        slug: slug ? slugify(slug) : slugify(name),
        description: description,
        specifications: specifications,
        variants: variants,
        brand: brand,
        coupons: coupons,
        seller: currentUser._id,
      });

      return {
        msg: 'Created product successfully',
        status: true,
        newProduct: newProduct,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAProduct(productIdDto: ProductIdDto) {
    const { _id } = productIdDto;
    try {
      const product = await this.productModel.findById(_id);
      if (!product) {
        return {
          msg: 'This product is not exists',
          status: false,
        };
      }
      return {
        msg: 'Found product successfully',
        status: true,
        product: product,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllProducts() {
    try {
      const allProducts = await this.productModel.find().sort({ title: 'asc' });
      if (allProducts.length > 0) {
        return {
          msg: 'Found all products successfully',
          status: true,
          allProducts: allProducts,
        };
      } else {
        return {
          msg: 'No products exist in the database',
          status: true,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    const {
      _id,
      name,
      slug,
      description,
      specifications,
      variants,
      brand,
      coupons,
    } = updateProductDto;
    try {
      const findProduct = await this.productModel.findById(_id);
      if (!findProduct) {
        return {
          msg: 'This product not exists',
          status: false,
        };
      }

      const updatedProduct = await this.productModel.findByIdAndUpdate(
        _id,
        {
          name: name,
          slug: slug,
          description: description,
          specifications: specifications,
          variants: variants,
          brand: brand,
          coupons: coupons,
        },
        {
          new: true,
        },
      );

      return {
        msg: 'Updated product successfully',
        status: true,
        updatedProduct: updatedProduct,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteAProduct(productIdDto: ProductIdDto) {
    const { _id } = productIdDto;
    try {
      const findProduct = await this.productModel.findById(_id);
      if (!findProduct) {
        return {
          msg: 'This product is not exist',
          status: false,
        };
      }

      const deletedProduct = await this.productModel.findByIdAndDelete(_id);
      return {
        msg: 'Deleted product successfully',
        status: true,
        deletedProduct: deletedProduct,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteManyProducts(req: Request) {
    const { productIds } = req.body;
    try {
      const deletedManyProducts = await this.productModel.deleteMany({
        _id: { $in: productIds },
      });

      return {
        msg: 'Deleted products successfully',
        status: true,
        deletedManyProducts: deletedManyProducts,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRatings(productIdDto: ProductIdDto) {
    const { _id } = productIdDto;
    try {
      const product = await this.productModel.findById(_id);
      const ratings = product.ratings;
      const detailPosterPromises = ratings.map(async (rating) => {
        const poster = await this.userModel.findById(rating.posted.toString());
        return poster;
      });
      const detailPosters = await Promise.all(detailPosterPromises);
      const detailRatings = ratings.map((rating) => {
        const poster = detailPosters.find((poster) => {
          return poster._id.toString() === rating.posted.toString();
        });

        return {
          star: rating.star,
          comment: rating.comment,
          posted: poster,
          createdAt: rating.createdAt,
        }
      })
      return detailRatings
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductByBrand(brandDto: BrandDto) {
    const { brand } = brandDto
    try {
      if (brand !== "") {
        if (!(brand in brandEnum)) {
          return {
            msg: 'Không có hãng điện thoại này!',
            status: false
          }
        }

        const getProductByBrand = await this.productModel.find({ brand: brand }).sort({ createdAt: -1 })
        return {
          status: true,
          products: getProductByBrand
        }
      } else {
        const getAllProducts = await this.productModel.find().sort({ createdAt: -1 })
        return {
          status: true,
          products: getAllProducts
        }
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

}
