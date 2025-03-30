import { Module } from '@nestjs/common';
import { StoreSellerService } from './store-seller.service';
import { StoreSellerController } from './store-seller.controller';

@Module({
  controllers: [StoreSellerController],
  providers: [StoreSellerService],
})
export class StoreSellerModule {}
