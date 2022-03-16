import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSaltSync, hashSync } from 'bcryptjs';

import { UserModel } from './user.model';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly _userModel: ModelType<UserModel>
  ) {}

  async createUser(dto: AuthDto) {
    const salt = genSaltSync(10);
    const newUser = new this._userModel({
      email: dto.login,
      passwordHash: hashSync(dto.password, salt),
    });

    return newUser.save();
  }

  async findUser(email: string) {
    return this._userModel.findOne({ email }).exec();
  }
}
