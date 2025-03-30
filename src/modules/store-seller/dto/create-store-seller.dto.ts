import { ApiProperty } from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  ValidateNested,
  IsArray,
  Matches,
  IsNumber,
} from 'class-validator';
import { Day } from '@prisma/client';

// DTO untuk jam operasional
export class OperationalHourDto {
  @ApiProperty({
    enum: Day,
    example: 'MONDAY',
    description: 'Hari operasional',
  })
  @IsEnum(Day)
  day: Day;

  @ApiProperty({
    example: '09:00',
    description: 'Jam buka (format: HH:mm)',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  openTime: string;

  @ApiProperty({
    example: '17:00',
    description: 'Jam tutup (format: HH:mm)',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  closeTime: string;

  @ApiProperty({
    example: false,
    description: 'Status tutup',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isClosed?: boolean;
}

export class CreateStoreSellerDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: 'Nama toko',
    example: 'Toko Elektronik',
  })
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @ApiProperty({
    description: 'Deskripsi toko',
    example:
      'Toko Elektronik untuk kebutuhan rumah tangga',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Logo toko (Wajib)',
  })
  @IsNotEmpty()
  logo: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Banner toko',
    required: false,
  })
  @IsOptional()
  banner?: any;

  @ApiProperty({
    description: 'Alamat toko',
    example: 'Jl. Raya No. 123, Kota Jakarta',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Provinsi toko',
    example: 'Jawa Tengah',
  })
  @IsNotEmpty()
  @IsString()
  province: string;

  @ApiProperty({
    description: 'Kota toko',
    example: 'Jakarta',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Kode pos toko',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'Nomor telepon toko',
    example: '081234567890',
  })
  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phoneNumber: string;

  @ApiProperty({
    description: 'Email toko',
    example: 'toko@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description:
      'Jam operasional toko (array of objects)',
    example: [
      {
        day: 'MONDAY',
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
      },
      {
        day: 'TUESDAY',
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperationalHourDto)
  operationalHours: OperationalHourDto[];

  @ApiProperty({
    description: 'Status buka toko',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isOpen?: boolean;

  @ApiProperty({
    description: 'Kebijakan pengembalian barang',
    example:
      'Barang yang rusak dapat dikembalikan dalam waktu 7 hari',
    required: false,
  })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @ApiProperty({
    description: 'Kebijakan pengiriman',
    example: 'Pengiriman 3-5 hari kerja',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingPolicy?: string;

  @ApiProperty({
    description:
      'ID kategori toko (bisa lebih dari satu)',
    example: [1, 2], // Array of category IDs
    type: [Number],
    required: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  categoryIds: number[];
}
