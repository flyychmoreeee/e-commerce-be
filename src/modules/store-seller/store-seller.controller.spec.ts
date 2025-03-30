import { Test, TestingModule } from '@nestjs/testing';
import { StoreSellerController } from './store-seller.controller';
import { StoreSellerService } from './store-seller.service';

describe('StoreSellerController', () => {
  let controller: StoreSellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreSellerController],
      providers: [StoreSellerService],
    }).compile();

    controller = module.get<StoreSellerController>(StoreSellerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
