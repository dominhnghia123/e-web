import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { access, constants } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor() { }

  async uploadFiles(file: Express.Multer.File, req: Request) {
    return {
      url: `${req.protocol}://${req.get('host')}/api/app/${file.filename}`,
    };
  }

  async getFile(req: Request, res: Response) {
    const fileName = req.params.fileName;
    const uploadsDirectory = join(__dirname, '../uploads');
    const filePath = join(uploadsDirectory, fileName);
    access(filePath, constants.F_OK, (err) => {
      if (!err) {
        return res.sendFile(filePath);
      }
      return {
        msg: 'File không tồn tại',
        status: false,
      }
    })
  }
}
