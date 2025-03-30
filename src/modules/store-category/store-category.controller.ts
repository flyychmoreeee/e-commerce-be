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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ACTIVATED_STORE_CATEGORY_RESPONSE,
  CREATE_STORE_CATEGORY_RESPONSE,
  DELETE_STORE_CATEGORY_RESPONSE,
  GET_ALL_STORE_CATEGORIES_RESPONSE,
  GET_STORE_CATEGORY_BY_ID_RESPONSE,
  UNACTIVE_STORE_CATEGORY_RESPONSE,
  UPDATE_STORE_CATEGORY_RESPONSE,
} from './swagger/store-category.swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('store-category')
export class StoreCategoryController {
  constructor(
    private readonly storeCategoryService: StoreCategoryService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Create a new store category',
  })
  @ApiResponse(CREATE_STORE_CATEGORY_RESPONSE)
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
  @ApiOperation({
    summary: 'Get all store categories',
  })
  @ApiResponse(GET_ALL_STORE_CATEGORIES_RESPONSE)
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
  @ApiOperation({
    summary: 'Get a store category by ID',
  })
  @ApiResponse(GET_STORE_CATEGORY_BY_ID_RESPONSE)
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
  @ApiOperation({
    summary: 'Update a store category by ID',
  })
  @ApiResponse(UPDATE_STORE_CATEGORY_RESPONSE)
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
  @ApiOperation({
    summary: 'Delete a store category by ID',
  })
  @ApiResponse(DELETE_STORE_CATEGORY_RESPONSE)
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
  @ApiOperation({
    summary: 'Unactive a store category by ID',
  })
  @ApiResponse(UNACTIVE_STORE_CATEGORY_RESPONSE)
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
  @ApiOperation({
    summary: 'Activated a store category by ID',
  })
  @ApiResponse(ACTIVATED_STORE_CATEGORY_RESPONSE)
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
