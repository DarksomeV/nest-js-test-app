import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import * as path from 'app-root-path';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${path}/uploads`,
  })],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
