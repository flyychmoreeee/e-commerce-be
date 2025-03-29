import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ERROR_CODES } from 'src/common/constants/response.constants';

@Injectable()
export class StoreCategoryService {
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
    createStoreCategoryDto: CreateStoreCategoryDto,
  ) {
    const slug = this.generateSlug(
      createStoreCategoryDto.name,
    );

    // Cek apakah slug sudah ada
    const existingSlug =
      await this.prisma.storeCategory.findUnique({
        where: { slug },
      });

    // Jika slug sudah ada, tambahkan random string
    const finalSlug = existingSlug
      ? `${slug}-${Math.random().toString(36).substring(2, 6)}`
      : slug;

    const storeCategory =
      await this.prisma.storeCategory.create({
        data: {
          ...createStoreCategoryDto,
          slug: finalSlug,
        },
      });
    return storeCategory;
  }

  async findAll() {
    const storeCategories =
      await this.prisma.storeCategory.findMany();
    return storeCategories;
  }

  async findOne(id: number) {
    const storeCategory =
      await this.prisma.storeCategory.findUnique({
        where: { id },
      });
    return storeCategory;
  }

  async update(
    id: number,
    updateStoreCategoryDto: UpdateStoreCategoryDto,
  ) {
    const existingStoreCategory =
      await this.prisma.storeCategory.findUnique({
        where: { id },
      });
    if (!existingStoreCategory) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store Category',
      });
    }
    const storeCategory =
      await this.prisma.storeCategory.update({
        where: { id },
        data: updateStoreCategoryDto,
      });
    return storeCategory;
  }

  async remove(id: number) {
    const existingStoreCategory =
      await this.prisma.storeCategory.findUnique({
        where: { id },
      });
    if (!existingStoreCategory) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store Category',
      });
    }
    await this.prisma.storeCategory.delete({
      where: { id },
    });
  }

  async unActive(id: number) {
    const existingStoreCategory =
      await this.prisma.storeCategory.findUnique({
        where: { id },
      });
    if (!existingStoreCategory) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store Category',
      });
    }
    await this.prisma.storeCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activated(id: number) {
    const existingStoreCategory =
      await this.prisma.storeCategory.findUnique({
        where: { id },
      });
    if (!existingStoreCategory) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store Category',
      });
    }
    await this.prisma.storeCategory.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
