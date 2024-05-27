import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cors from 'cors';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './utils/stripe/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //cấu hình api lên swagger
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Website')
    .setDescription('The ecommerce website API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useStaticAssets(path.join(__dirname, './uploads'));
  app.use(cors());

  // config để có thể connect với stripe thông qua webhook
  app.use(rawBodyMiddleware());

  //config để sử dụng class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  await app.listen(8000);
}
bootstrap();
