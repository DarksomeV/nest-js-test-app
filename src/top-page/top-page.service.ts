import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly _topPageModel: ModelType<TopPageModel>) {}

  async create(dto: CreateTopPageDto) {
    return this._topPageModel.create(dto)
  }

  async findByAlias(alias: string) {
    return this._topPageModel.findOne({ alias }).exec();
  }

  async findById(id: string) {
    return this._topPageModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this._topPageModel.findByIdAndRemove(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this._topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this._topPageModel.aggregate([
      {
        $match: {
          firstCategory
        }
      },
      {
        $group: {
          _id: {
            secondCategory: "$secondCategory",
            pages: { $push: { alias: '$alias', title: '$title' } }
          }
        }
      }
    ]).exec();
  }

  async findByText(text: string) {
    return this._topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
  }
}