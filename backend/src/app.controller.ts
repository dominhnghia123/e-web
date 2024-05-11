import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';

@ApiTags('App')
@Controller('api/app')
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/uploadFiles')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadFiles(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.appService.uploadFiles(file, req);
  }

  @Get('/:fileName')
  getFile(@Req() req: Request, @Res() res: Response) {
    return this.appService.getFile(req, res);
  }
}
