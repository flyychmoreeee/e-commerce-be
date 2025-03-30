import { PartialType } from '@nestjs/swagger';
import { CreateStoreSellerDto } from './create-store-seller.dto';

export class UpdateStoreSellerDto extends PartialType(
  CreateStoreSellerDto,
) {}
