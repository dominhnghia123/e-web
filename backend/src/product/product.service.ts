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
import { CreateRatingDto } from './dto/create-rating.dto';

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

  async getAllProducts(
    keySearch?: string,
    currentPage?: number,
    itemsPerPage?: number,
  ) {
    try {
      let options = {}
      if (keySearch) {
        options = {
          $or: [
            { name: new RegExp(keySearch.toString(), 'i') },
            { brand: new RegExp(keySearch.toString(), 'i') },
          ],
        }
      }

      const products = await this.productModel.find(options)

      const page: number = currentPage || 1
      const limit: number = itemsPerPage || 100
      const skip: number = (page - 1) * limit

      const totalProducts = await this.productModel.countDocuments(options)
      const data = products.slice(skip, skip + limit)

      return {
        status: true,
        data,
        totalProducts,
        page,
        limit,
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

  async createRating(createRatingDto: CreateRatingDto, req: Request) {
    const { productId, star, comment } = createRatingDto;
    const { _id } = req['user']
    try {
      const product = await this.productModel.findById(productId);
      let alreadyRated = product.ratings.find(
        (rating) => rating.posted.toString() === _id.toString()
      );
      if (alreadyRated) {
        const updateRating = await this.productModel.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
      } else {
        const rateProduct = await this.productModel.findByIdAndUpdate(
          productId,
          {
            $push: {
              ratings: {
                star: star,
                comment: comment,
                posted: _id,
              },
            },
          },
          {
            new: true,
          }
        );
      }

      const getallratings = await this.productModel.findById(productId);
      let totalRating = getallratings.ratings.length;

      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);

      let actualRatings = parseFloat((ratingsum / totalRating).toFixed(1));

      let finalproduct = await this.productModel.findByIdAndUpdate(
        productId,
        {
          totalRatings: actualRatings,
        },
        { new: true }
      );
      return {
        msg: 'Cảm ơn vì đã góp ý và đánh giá sản phẩm của chúng tôi',
        status: true,
        finalproduct
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

}
