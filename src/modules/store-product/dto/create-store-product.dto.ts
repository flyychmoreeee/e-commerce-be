import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateStoreProductDto {
  @ApiProperty({
    description: 'Id of the store',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  storeId: number;

  @ApiProperty({
    description: 'Id of the product category',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Product 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Description of the product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Stock of the product',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
