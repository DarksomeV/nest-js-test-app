import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ProductModel } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private  readonly _productModel: ModelType<ProductModel>) {}

  async create(dto: CreateProductDto): Promise<ProductModel> {
    return this._productModel.create(dto);
  }

  async findById(id: string): Promise<ProductModel> {
    return this._productModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<DocumentType<ProductModel | null>> {
    return this._productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this._productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this._productModel.aggregate([
      {
        $match: {
          categories: dto.category
        }
      },
      {
        $sort: {
          _id: 1,
        }
      },
      {
        $limit: dto.limit
      },
      {
        $lookup: {
          from: 'Review',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviewCount: { $size: '$reviews' },
          reviewAvg: { $avg: '$reviews.rating' }
        }
      }
    ]).exec();
  }
}
