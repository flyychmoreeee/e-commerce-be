import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateStoreCategoryDto {
  @ApiProperty({
    description: 'Nama kategori',
    example: 'Kategori 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Deskripsi kategori',
    example: 'Deskripsi kategori 1',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
