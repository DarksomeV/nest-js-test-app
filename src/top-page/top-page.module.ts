import { Module } from '@nestjs/common';

import { TopPageController } from './top-page.controller';
import { TopPageService } from './top-page.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model';

@Module({
  controllers: [TopPageController],
  providers: [TopPageService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TopPageModel,
        schemaOptions: {
          collection: 'TopPage',
        },
      },
    ]),
  ],
})
export class TopPageModule {}
