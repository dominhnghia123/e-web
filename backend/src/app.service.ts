import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor() {}

  async uploadFiles(file: Express.Multer.File, req: Request) {
    return {
      url: `${req.protocol}://${req.get('host')}/${file.filename}`,
    };
  }
}
