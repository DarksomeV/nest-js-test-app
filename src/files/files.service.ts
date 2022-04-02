import { Injectable } from '@nestjs/common';

import { format } from 'date-fns';
import * as path from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

import { FileElementResponse } from './dto/file-element.response';


@Injectable()
export class FilesService {
  async saveFiles(files: Express.Multer.File[]): Promise<FileElementResponse[]> {
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
}
