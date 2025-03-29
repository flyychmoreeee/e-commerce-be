import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StoreCategoryService } from './store-category.service';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';
import { SUCCESS_CODES } from 'src/common/constants/response.constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('store-category')
export class StoreCategoryController {
  constructor(
    private readonly storeCategoryService: StoreCategoryService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Post()
  async create(
    @Body()
    createStoreCategoryDto: CreateStoreCategoryDto,
  ) {
    const data =
      await this.storeCategoryService.create(
        createStoreCategoryDto,
      );

    return {
      code: SUCCESS_CODES.DATA_CREATED,
      entity: 'Store Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @Get()
  async findAll() {
    const data =
      await this.storeCategoryService.findAll();

    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data =
      await this.storeCategoryService.findOne(
        +id,
      );

    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateStoreCategoryDto: UpdateStoreCategoryDto,
  ) {
    const data =
      await this.storeCategoryService.update(
        +id,
        updateStoreCategoryDto,
      );

    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storeCategoryService.remove(+id);

    return {
      code: SUCCESS_CODES.DATA_DELETED,
      entity: 'Store Category',
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/unactive')
  async unActive(@Param('id') id: string) {
    await this.storeCategoryService.unActive(+id);

    return {
      code: SUCCESS_CODES.DATA_UNACTIVE,
      entity: 'Store Category',
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/activated')
  async activated(@Param('id') id: string) {
    await this.storeCategoryService.activated(
      +id,
    );

    return {
      code: SUCCESS_CODES.DATA_ACTIVATED,
      entity: 'Store Category',
    };
  }
}
