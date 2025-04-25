import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ERROR_CODES } from 'src/common/constants/response.constants';

@Injectable()
export class StoreProductService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Hapus karakter spesial
      .replace(/\s+/g, '-') // Ganti spasi dengan strip
      .replace(/-+/g, '-') // Hindari multiple strip
      .replace(/^-+|-+$/g, ''); // Hapus strip di awal dan akhir
  }

  async create(
    createStoreProductDto: CreateStoreProductDto,
  ) {
    const product =
      await this.prisma.product.create({
        data: {
          ...createStoreProductDto,
          slug: this.generateSlug(
            createStoreProductDto.name,
          ),
        },
      });

    return product;
  }

  async findAll() {
    const products =
      await this.prisma.product.findMany({
        include: {
          photos: true,
        },
      });

    return products;
  }

  async findOne(id: number) {
    const product =
      await this.prisma.product.findUnique({
        where: { id },
        include: {
          photos: true,
        },
      });

    if (!product) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Product',
      });
    }
    return product;
  }

  async update(
    id: number,
    updateStoreProductDto: UpdateStoreProductDto,
  ) {
    const existingProduct =
      await this.prisma.product.findUnique({
        where: { id },
      });

    if (!existingProduct) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Product',
      });
    }

    const product =
      await this.prisma.product.update({
        where: { id },
        data: {
          ...updateStoreProductDto,
          slug: this.generateSlug(
            updateStoreProductDto.name ?? '',
          ),
        },
      });

    return product;
  }

  async remove(id: number) {
    const existingProduct =
      await this.prisma.product.findUnique({
        where: { id },
      });

    if (!existingProduct) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Product',
      });
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return existingProduct;
  }

  async getProductByStoreId(storeId: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id: storeId },
      });
    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }
    const products =
      await this.prisma.product.findMany({
        where: { storeId },
      });
    return products;
  }
}
