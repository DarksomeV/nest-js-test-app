import { Module } from '@nestjs/common';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReviewModel } from './review.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReviewModel,
        schemaOptions: {
          collection: 'Review',
        },
      },
    ]),
  ],
})
export class ReviewModule {}
