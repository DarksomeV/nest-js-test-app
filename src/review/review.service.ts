import { Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ReviewModel } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel) private readonly _reviewModel: ModelType<ReviewModel>
  ) {}

  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return this._reviewModel.create(dto);
  }

  async delete(id: string): Promise<DocumentType<ReviewModel | null>> {
    return this._reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
    return this._reviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
  }

  async deleteByProductId(productId: string): Promise<{ deletedCount?: number }> {
    return this._reviewModel.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
  }
}
