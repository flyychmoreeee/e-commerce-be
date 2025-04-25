import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreSellerDto } from './dto/create-store-seller.dto';
import { UpdateStoreSellerDto } from './dto/update-store-seller.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ERROR_CODES } from 'src/common/constants/response.constants';
import * as fs from 'fs';

@Injectable()
export class StoreSellerService {
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

  private validateFile(
    file: Express.Multer.File,
    fieldName: string,
  ) {
    if (!file) {
      throw new BadRequestException(
        `${fieldName} is required`,
      );
    }

    // Validasi tipe file
    if (
      !file.mimetype.match(
        /^image\/(png|jpg|jpeg)$/,
      )
    ) {
      this.deleteFile(file.path);
      throw new BadRequestException(
        `${fieldName} must be an image file (PNG, JPG, JPEG)`,
      );
    }

    // Validasi ukuran file (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.deleteFile(file.path);
      throw new BadRequestException(
        `${fieldName} size should not exceed 2MB`,
      );
    }
  }

  private deleteFile(filePath: string) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(
        'Error deleting file:',
        error,
      );
    }
  }

  async create(
    createStoreSellerDto: CreateStoreSellerDto,
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    try {
      // Validasi categories exist
      const categories =
        await this.prisma.storeCategory.findMany({
          where: {
            id: {
              in: createStoreSellerDto.categoryIds,
            },
            isActive: true, // Hanya kategori yang aktif
          },
        });

      if (
        categories.length !==
        createStoreSellerDto.categoryIds.length
      ) {
        throw new BadRequestException(
          'Some category IDs are invalid or inactive',
        );
      }

      // Validasi file
      if (!files.logo?.[0]) {
        throw new BadRequestException(
          'Logo is required',
        );
      }
      this.validateFile(files.logo[0], 'Logo');

      if (files.banner?.[0]) {
        this.validateFile(
          files.banner[0],
          'Banner',
        );
      }

      // Pastikan operationalHours adalah array
      if (
        !Array.isArray(
          createStoreSellerDto.operationalHours,
        )
      ) {
        throw new BadRequestException(
          'Operational hours must be an array',
        );
      }

      const slug = this.generateSlug(
        createStoreSellerDto.storeName,
      );

      return await this.prisma.$transaction(
        async (prisma) => {
          // Buat store
          const store = await prisma.store.create(
            {
              data: {
                userId:
                  createStoreSellerDto.userId,
                storeName:
                  createStoreSellerDto.storeName,
                slug,
                description:
                  createStoreSellerDto.description,
                logo: files.logo?.[0]?.path ?? '',
                banner: files.banner?.[0]?.path,
                address:
                  createStoreSellerDto.address,
                province:
                  createStoreSellerDto.province,
                city: createStoreSellerDto.city,
                postalCode:
                  createStoreSellerDto.postalCode,
                phoneNumber:
                  createStoreSellerDto.phoneNumber,
                email: createStoreSellerDto.email,
                isOpen: Boolean(
                  createStoreSellerDto.isOpen,
                ),
                returnPolicy:
                  createStoreSellerDto.returnPolicy,
                shippingPolicy:
                  createStoreSellerDto.shippingPolicy,
                categories: {
                  createMany: {
                    data: createStoreSellerDto.categoryIds.map(
                      (categoryId) => ({
                        categoryId,
                      }),
                    ),
                  },
                },
              },
            },
          );

          // Buat jam operasional
          await prisma.operationalHours.createMany(
            {
              data: createStoreSellerDto.operationalHours.map(
                (oh) => ({
                  storeId: store.id,
                  day: oh.day,
                  openTime: oh.openTime,
                  closeTime: oh.closeTime,
                  isClosed: oh.isClosed ?? false,
                }),
              ),
            },
          );

          await prisma.user.update({
            where: {
              id: createStoreSellerDto.userId,
            },
            data: { role: 'SELLER' },
          });

          // Return dengan include categories dan operationalHours
          const storeWithOperationalHours =
            await prisma.store.findUnique({
              where: { id: store.id },
              include: {
                operationalHours: true,
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            });
          return storeWithOperationalHours;
        },
      );
    } catch (error) {
      // Hapus file jika terjadi error
      if (files.logo?.[0]?.path) {
        this.deleteFile(files.logo[0].path);
      }
      if (files.banner?.[0]?.path) {
        this.deleteFile(files.banner[0].path);
      }
      throw error;
    }
  }

  async findAll() {
    const stores =
      await this.prisma.store.findMany({
        include: {
          operationalHours: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    return stores;
  }

  async findOne(id: number) {
    const store =
      await this.prisma.store.findUnique({
        where: { id },
        include: {
          operationalHours: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    return store;
  }

  async update(
    id: number,
    updateStoreSellerDto: UpdateStoreSellerDto,
    files?: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    try {
      // Cek toko ada atau tidak
      const existingStore =
        await this.prisma.store.findUnique({
          where: { id },
        });

      if (!existingStore) {
        throw new NotFoundException({
          code: ERROR_CODES.NOT_FOUND,
          entity: 'Store',
        });
      }

      // Validasi categories jika ada update
      if (
        updateStoreSellerDto.categoryIds?.length
      ) {
        const categories =
          await this.prisma.storeCategory.findMany(
            {
              where: {
                id: {
                  in: updateStoreSellerDto.categoryIds,
                },
                isActive: true,
              },
            },
          );

        if (
          categories.length !==
          updateStoreSellerDto.categoryIds.length
        ) {
          throw new BadRequestException(
            'Some category IDs are invalid or inactive',
          );
        }
      }

      // Siapkan data update
      const updateData: any = {
        ...updateStoreSellerDto,
      };

      // Handle logo baru jika ada
      if (files?.logo?.[0]) {
        this.validateFile(files.logo[0], 'Logo');
        // Hapus logo lama
        if (existingStore.logo) {
          this.deleteFile(existingStore.logo);
        }
        updateData.logo = files.logo[0].path;
      }

      // Handle banner baru jika ada
      if (files?.banner?.[0]) {
        this.validateFile(
          files.banner[0],
          'Banner',
        );
        // Hapus banner lama
        if (existingStore.banner) {
          this.deleteFile(existingStore.banner);
        }
        updateData.banner = files.banner[0].path;
      }

      // Update slug jika nama toko berubah
      if (updateStoreSellerDto.storeName) {
        const newSlug = this.generateSlug(
          updateStoreSellerDto.storeName,
        );
        // Cek apakah slug baru sudah ada dan bukan milik toko ini
        const existingSlug =
          await this.prisma.store.findFirst({
            where: {
              slug: newSlug,
              id: { not: id },
            },
          });

        updateData.slug = existingSlug
          ? `${newSlug}-${Math.random().toString(36).substring(2, 6)}`
          : newSlug;
      }

      // Update store dengan transaction
      return await this.prisma.$transaction(
        async (prisma) => {
          // Update categories jika ada
          if (updateStoreSellerDto.categoryIds) {
            // Hapus categories lama
            await prisma.storeCategoryRelation.deleteMany(
              {
                where: { storeId: id },
              },
            );

            // Buat categories baru
            await prisma.storeCategoryRelation.createMany(
              {
                data: updateStoreSellerDto.categoryIds.map(
                  (categoryId) => ({
                    storeId: id,
                    categoryId,
                  }),
                ),
              },
            );
          }

          // Hapus jam operasional lama jika ada update
          if (
            updateStoreSellerDto.operationalHours
          ) {
            await prisma.operationalHours.deleteMany(
              {
                where: { storeId: id },
              },
            );

            // Buat jam operasional baru
            await prisma.operationalHours.createMany(
              {
                data: updateStoreSellerDto.operationalHours.map(
                  (oh) => ({
                    storeId: id,
                    day: oh.day,
                    openTime: oh.openTime,
                    closeTime: oh.closeTime,
                    isClosed:
                      oh.isClosed ?? false,
                  }),
                ),
              },
            );
          }

          // Update store
          const updatedStore =
            await prisma.store.update({
              where: { id },
              data: updateData,
              include: {
                operationalHours: true,
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            });

          return updatedStore;
        },
      );
    } catch (error) {
      // Hapus file baru jika terjadi error
      if (files?.logo?.[0]?.path) {
        this.deleteFile(files.logo[0].path);
      }
      if (files?.banner?.[0]?.path) {
        this.deleteFile(files.banner[0].path);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
        include: {
          operationalHours: true,
          user: true,
        },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    try {
      await this.prisma.$transaction(
        async (prisma) => {
          // Hapus jam operasional
          await prisma.operationalHours.deleteMany(
            {
              where: { storeId: id },
            },
          );

          // Update user role kembali ke BUYER
          await prisma.user.update({
            where: { id: existingStore.userId },
            data: { role: 'BUYER' },
          });

          // Hapus toko
          await prisma.store.delete({
            where: { id },
          });
        },
      );

      // Hapus file setelah transaksi berhasil
      if (existingStore.logo) {
        this.deleteFile(existingStore.logo);
      }
      if (existingStore.banner) {
        this.deleteFile(existingStore.banner);
      }

      return {
        message: 'Store deleted successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        code: ERROR_CODES.APP_SERVER_ERROR,
        message: 'Failed to delete store',
      });
    }
  }

  async inactiveStore(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    await this.prisma.store.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    await this.prisma.user.update({
      where: { id: existingStore.userId },
      data: { role: 'BUYER' },
    });

    return {
      message: 'Store inactive successfully',
    };
  }

  async suspendStore(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    await this.prisma.store.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });

    await this.prisma.user.update({
      where: { id: existingStore.userId },
      data: { role: 'BUYER' },
    });

    return {
      message: 'Store suspended successfully',
    };
  }

  async banStore(id: number) {
    try {
      return await this.prisma.$transaction(
        async (prisma) => {
          // 1. Cek store exists
          const store =
            await prisma.store.findUnique({
              where: { id },
              include: {
                user: true,
                operationalHours: true,
                categories: true,
              },
            });

          if (!store) {
            throw new NotFoundException({
              code: ERROR_CODES.NOT_FOUND,
              entity: 'Store',
            });
          }

          // 2. Hapus relasi-relasi store
          // Hapus operational hours
          await prisma.operationalHours.deleteMany(
            {
              where: { storeId: id },
            },
          );

          // Hapus category relations
          await prisma.storeCategoryRelation.deleteMany(
            {
              where: { storeId: id },
            },
          );

          // 3. Update status store menjadi BANNED
          await prisma.store.update({
            where: { id },
            data: { status: 'BANNED' },
          });

          // 4. Hapus store
          await prisma.store.delete({
            where: { id },
          });

          await prisma.user.delete({
            where: { id: store.userId },
          });

          return {
            message:
              'Store and associated user have been banned successfully',
          };
        },
      );
    } catch {
      throw new InternalServerErrorException({
        code: ERROR_CODES.APP_SERVER_ERROR,
        message: 'Failed to ban store and user',
      });
    }
  }

  async verifyStore(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    await this.prisma.store.update({
      where: { id },
      data: { isVerified: true },
    });

    return {
      message: 'Store verified successfully',
    };
  }

  async featuredStore(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    await this.prisma.store.update({
      where: { id },
      data: { isFeatured: true },
    });

    return {
      message: 'Store featured successfully',
    };
  }

  async unfeaturedStore(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    await this.prisma.store.update({
      where: { id },
      data: { isFeatured: false },
    });

    return {
      message: 'Store unfeatured successfully',
    };
  }

  async unverifiedStore(id: number) {
    const existingStore =
      await this.prisma.store.findUnique({
        where: { id },
      });

    if (!existingStore) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        entity: 'Store',
      });
    }

    await this.prisma.store.update({
      where: { id },
      data: { isVerified: false },
    });

    return {
      message: 'Store unverified successfully',
    };
  }
}
