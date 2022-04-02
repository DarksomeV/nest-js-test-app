import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmailDecorator } from '../decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly _reviewService: ReviewService,
    private readonly _telegramService: TelegramService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this._reviewService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message = `Имя: ${dto.name}\n`
      + `Заголовок: ${dto.title}\n`
      + `Описание: ${dto.description}\n`
      + `Рейтинг: ${dto.rating}\n`
      + `ID продукта: ${dto.productId}`;
    return this._telegramService.sendMessage(message)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this._reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) id: string, @UserEmailDecorator() email: string) {
    return this._reviewService.findByProductId(id);
  }
}
