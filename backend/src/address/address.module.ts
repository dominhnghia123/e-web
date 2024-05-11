import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Address, AddressSchema } from './address.schema';
import { AddressController } from './address.controler';
import { AddressService } from './address.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    UserModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
