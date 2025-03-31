import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { StoreSellerService } from './store-seller.service';
import {
  CreateStoreSellerDto,
  OperationalHourDto,
} from './dto/create-store-seller.dto';
import { UpdateStoreSellerDto } from './dto/update-store-seller.dto';
import { SUCCESS_CODES } from 'src/common/constants/response.constants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/common/decorators/public.decorator';
import { Day } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('store-seller')
export class StoreSellerController {
  constructor(
    private readonly storeSellerService: StoreSellerService,
  ) {}

  // Helper function untuk parse boolean
  private parseBoolean(
    value: string | boolean | undefined,
  ): boolean {
    if (typeof value === 'string') {
      return value === 'true';
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return true;
  }

  // Helper function untuk parse operational hours
  private parseOperationalHours(
    operationalHours: any,
  ): OperationalHourDto[] {
    if (typeof operationalHours === 'string') {
      try {
        const parsedHours = JSON.parse(
          operationalHours,
        );
        return Array.isArray(parsedHours)
          ? parsedHours.filter(
              (oh): oh is OperationalHourDto => {
                return (
                  oh &&
                  typeof oh === 'object' &&
                  'day' in oh &&
                  'openTime' in oh &&
                  'closeTime' in oh &&
                  Object.values(Day).includes(
                    oh.day as Day,
                  )
                );
              },
            )
          : [];
      } catch {
        throw new BadRequestException(
          'Invalid operational hours format',
        );
      }
    }
    return [];
  }

  private parseCategoryIds(
    categoryIds: string | number[],
  ): number[] {
    if (typeof categoryIds === 'string') {
      // Handle jika input berupa string "1,2,3"
      return categoryIds
        .split(',')
        .map((id) => +id);
    }
    // Jika sudah array, pastikan semua element adalah number
    if (Array.isArray(categoryIds)) {
      return categoryIds.map((id) => +id);
    }
    return [];
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.BUYER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/stores',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() +
              '-' +
              Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new store' })
  @Post()
  async create(
    @Body()
    createStoreSellerDto: CreateStoreSellerDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    // Transform data types dengan helper functions
    const transformedDto = {
      ...createStoreSellerDto,
      userId: +createStoreSellerDto.userId,
      isOpen: this.parseBoolean(
        createStoreSellerDto.isOpen,
      ),
      operationalHours:
        this.parseOperationalHours(
          createStoreSellerDto.operationalHours,
        ),
      categoryIds: this.parseCategoryIds(
        createStoreSellerDto.categoryIds,
      ),
    };

    const data =
      await this.storeSellerService.create(
        transformedDto,
        files,
      );

    return {
      code: SUCCESS_CODES.DATA_CREATED,
      entity: 'Store',
      data,
    };
  }

  @Public()
  @ApiOperation({ summary: 'Get all stores' })
  @Get()
  async findAll() {
    const data =
      await this.storeSellerService.findAll();
    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Get a store by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data =
      await this.storeSellerService.findOne(+id);
    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/stores',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() +
              '-' +
              Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a store' })
  async update(
    @Param('id') id: string,
    @Body()
    updateStoreSellerDto: UpdateStoreSellerDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    // Transform data types
    const transformedDto = {
      ...updateStoreSellerDto,
      // Hanya transform jika field tersebut ada dalam request
      ...(updateStoreSellerDto.userId && {
        userId: +updateStoreSellerDto.userId,
      }),
      ...(updateStoreSellerDto.isOpen !==
        undefined && {
        isOpen: this.parseBoolean(
          updateStoreSellerDto.isOpen,
        ),
      }),
      ...(updateStoreSellerDto.operationalHours && {
        operationalHours:
          this.parseOperationalHours(
            updateStoreSellerDto.operationalHours,
          ),
      }),
      ...(updateStoreSellerDto.categoryIds && {
        categoryIds: this.parseCategoryIds(
          updateStoreSellerDto.categoryIds,
        ),
      }),
    };

    const data =
      await this.storeSellerService.update(
        +id,
        transformedDto,
        files,
      );

    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Delete a store' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data =
      await this.storeSellerService.remove(+id);
    return {
      code: SUCCESS_CODES.DATA_DELETED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Inactive a store' })
  @Patch(':id/inactive')
  async inactiveStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.inactiveStore(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Suspend a store' })
  @Patch(':id/suspend')
  async suspendStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.suspendStore(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Ban a store' })
  @Patch(':id/ban')
  async banStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.banStore(+id);
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Verify a store' })
  @Patch(':id/verify')
  async verifyStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.verifyStore(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Unverify a store' })
  @Patch(':id/unverify')
  async unverifyStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.unverifiedStore(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Feature a store' })
  @Patch(':id/feature')
  async featureStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.featuredStore(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Unfeature a store' })
  @Patch(':id/unfeature')
  async unfeatureStore(@Param('id') id: string) {
    const data =
      await this.storeSellerService.unfeaturedStore(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store',
      data,
    };
  }
}
