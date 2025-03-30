import { Test, TestingModule } from '@nestjs/testing';
import { StoreSellerService } from './store-seller.service';

describe('StoreSellerService', () => {
  let service: StoreSellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreSellerService],
    }).compile();

    service = module.get<StoreSellerService>(StoreSellerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
