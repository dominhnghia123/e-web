import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/user.schema';
import { RequestSeller, RequestSellerSchema } from './requestSeller.schema';
import { RequestSellerController } from './requestSeller.controller';
import { RequestSellerService } from './requestSeller.service';
import { AppService } from '../app.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestSeller.name, schema: RequestSellerSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
  ],
  controllers: [RequestSellerController],
  providers: [RequestSellerService, AppService],
})
export class RequestSellerModule {}
