import { Injectable } from '@nestjs/common';

import { format } from 'date-fns';
import * as path from 'app-root-path';
import * as sharp from 'sharp';
import { ensureDir, writeFile } from 'fs-extra';

import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './mfile';


@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const date = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${date}`;

    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({ url: `${date}/${file.originalname}`, name: file.originalname })
    }

    return res;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file)
      .webp()
      .toBuffer();
  }
}
