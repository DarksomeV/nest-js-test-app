import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile';

@Controller('files')
export class FilesController {
  constructor(private _filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
    const filesForSave: MFile[] = [new MFile(file)];

    if (file.mimetype.includes('image')) {
      const webP = await this._filesService.convertToWebP(file.buffer);

      filesForSave.push(new MFile({ originalname: `${file.originalname.split('.')[0]}.webp`, buffer: webP }));
    }
    return this._filesService.saveFiles(filesForSave);
  }
}
