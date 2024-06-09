import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { access, constants } from 'fs';
import { join } from 'path';
import nodemailer from 'nodemailer';

interface DataPayload {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class AppService {
  constructor() {}

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
      };
    });
  }

  async sendEmail(dataPayload: DataPayload) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      return transporter.sendMail({
        from: process.env.USER,
        to: dataPayload.to,
        subject: dataPayload.subject,
        text: dataPayload.text,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
