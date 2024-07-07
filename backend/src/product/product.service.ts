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
import slugify from 'slugify';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async createProduct(createProductDto: CreateProductDto, req: Request) {
    const { name, slug, description, specifications, variants, brand } =
      createProductDto;
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
        msg: 'Bạn đã thêm mới sản phẩm thành công.',
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
          msg: 'Sản phẩm này không tồn tại',
          status: false,
        };
      }
      return {
        status: true,
        product: product,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductsByBrand(brandDto: BrandDto, req: Request) {
    const { brand } = brandDto;
    const keySearch: string = req.query?.s?.toString();
    const currentPage: number = req.query.page as any;
    const itemsPerPage: number = req.query.limit as any;
    try {
      const options: any =
        brand !== ''
          ? {
              brand: brand,
            }
          : {};

      if (keySearch) {
        options.$or = [
          { name: new RegExp(keySearch, 'i') },
          { brand: new RegExp(keySearch, 'i') },
        ];
      }

      const getProductsByBrand = await this.productModel
        .find(options)
        .sort({ createdAt: -1 });

      const page: number = currentPage || 1;
      const limit: number = itemsPerPage || 10;
      const skip: number = (page - 1) * limit;

      const totalProducts = await this.productModel.countDocuments(options);
      const data = getProductsByBrand.slice(
        skip,
        parseInt(skip.toString()) + parseInt(limit.toString()),
      );
      return {
        status: true,
        products: data,
        totalProducts,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductsByUser(req: Request) {
    const userId = req['user']._id;
    const keySearch: string = req.query?.s?.toString();
    const currentPage: number = req.query.page as any;
    const itemsPerPage: number = req.query.limit as any;
    try {
      const options: any = {
        seller: userId,
      };

      if (keySearch) {
        options.$or = [
          { name: new RegExp(keySearch, 'i') },
          { brand: new RegExp(keySearch, 'i') },
        ];
      }

      const products = await this.productModel.find(options);

      const page: number = currentPage || 1;
      const limit: number = itemsPerPage || 100;
      const skip: number = (page - 1) * limit;

      const totalProducts = await this.productModel.countDocuments(options);
      const data = products.slice(skip, skip + limit);

      return {
        status: true,
        data,
        totalProducts,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProduct(updateProductDto: UpdateProductDto, req: Request) {
    const { _id, name, slug, description, specifications, variants, brand } =
      updateProductDto;
    const userId = req['user']._id;
    try {
      const findProduct = await this.productModel.findOne({
        _id: _id,
        seller: userId,
      });
      if (!findProduct) {
        return {
          msg: 'Sản phẩm này không tồn tại',
          status: false,
        };
      }

      if (!slug) {
        const alreadySlugProduct = await this.productModel.findOne({
          slug: slugify(name),
          _id: {
            $ne: _id,
          },
        });
        if (alreadySlugProduct) {
          return {
            msg: 'Slug này đã tồn tại',
            status: false,
          };
        }
        updateProductDto.slug = slugify(name);
      } else {
        const alreadySlugProduct = await this.productModel.findOne({
          slug: slugify(slug),
          _id: {
            $ne: _id,
          },
        });
        if (alreadySlugProduct) {
          return {
            msg: 'Slug này đã tồn tại',
            status: false,
          };
        }
        updateProductDto.slug = slugify(slug);
      }

      const updatedProduct = await this.productModel.findByIdAndUpdate(
        _id,
        {
          name: name,
          slug: updateProductDto.slug,
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
        msg: 'Cập nhật sản phẩm thành công!',
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
      await this.productModel.findByIdAndDelete(_id);
      return {
        msg: 'Xóa sản phẩm thành công.',
        status: true,
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
        };
      });
      return detailRatings;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createRating(createRatingDto: CreateRatingDto, req: Request) {
    const { productId, star, comment } = createRatingDto;
    const { _id } = req['user'];
    try {
      const product = await this.productModel.findById(productId);
      const alreadyRated = product.ratings.find(
        (rating) => rating.posted.toString() === _id.toString(),
      );
      if (alreadyRated) {
        await this.productModel.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
          },
          {
            new: true,
          },
        );
      } else {
        await this.productModel.findByIdAndUpdate(
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
          },
        );
      }

      const getallratings = await this.productModel.findById(productId);
      const totalRating = getallratings.ratings.length;

      const ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce(
          (prev, curr) => parseInt(prev.toString()) + parseInt(curr.toString()),
          0,
        );

      const actualRatings = parseFloat((ratingsum / totalRating).toFixed(1));

      const finalproduct = await this.productModel.findByIdAndUpdate(
        productId,
        {
          totalRatings: actualRatings,
        },
        { new: true },
      );
      return {
        msg: 'Cảm ơn vì đã góp ý và đánh giá sản phẩm của chúng tôi',
        status: true,
        finalproduct,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async countProductsBySeller(req: Request) {
    const userId = req['user']._id;
    try {
      const countProducts = await this.productModel.countDocuments({
        seller: userId,
      });
      return {
        status: true,
        countProducts,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async countAllProducts() {
    try {
      const countAllProducts = await this.productModel.countDocuments({});
      return {
        status: true,
        countAllProducts,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
