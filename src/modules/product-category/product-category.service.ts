import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const createProductCategory =
      await this.prisma.productCategory.create({
        data: {
          ...createProductCategoryDto,
          slug: createProductCategoryDto.name
            .toLowerCase()
            .replace(/ /g, '-'),
        },
      });

    return createProductCategory;
  }

  async findAll() {
    const productCategories =
      await this.prisma.productCategory.findMany();
    return productCategories;
  }

  async findOne(id: number) {
    const productCategory =
      await this.prisma.productCategory.findUnique(
        {
          where: {
            id,
          },
        },
      );
    return productCategory;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    const updateProductCategory =
      await this.prisma.productCategory.update({
        where: {
          id,
        },
        data: {
          ...updateProductCategoryDto,
          slug: updateProductCategoryDto.name
            ? updateProductCategoryDto.name
                .toLowerCase()
                .replace(/ /g, '-')
            : undefined,
        },
      });
    return updateProductCategory;
  }

  async remove(id: number) {
    return await this.prisma.productCategory.delete(
      {
        where: {
          id,
        },
      },
    );
  }

  async unActiveProductCategory(id: number) {
    return await this.prisma.productCategory.update(
      {
        where: { id },
        data: { isActive: false },
      },
    );
  }

  async activeProductCategory(id: number) {
    return await this.prisma.productCategory.update(
      {
        where: { id },
        data: { isActive: true },
      },
    );
  }
}
