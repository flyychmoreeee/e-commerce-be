import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({
    description: 'Nama kategori produk',
    example: 'Pakaian',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Deskripsi kategori produk',
    example:
      'Pakaian adalah kategori produk yang digunakan untuk menampilkan produk pakaian',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Status kategori produk',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
