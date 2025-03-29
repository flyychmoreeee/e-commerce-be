import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { StoreCategoryService } from './store-category.service';

describe('StoreCategoryService', () => {
  let service: StoreCategoryService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [StoreCategoryService],
      }).compile();

    service = module.get<StoreCategoryService>(
      StoreCategoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
