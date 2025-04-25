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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SUCCESS_CODES } from 'src/common/constants/response.constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import {
  CREATE_PRODUCT_CATEGORY_RESPONSE,
  GET_ALL_PRODUCT_CATEGORIES_RESPONSE,
  GET_PRODUCT_CATEGORY_BY_ID_RESPONSE,
  UPDATE_PRODUCT_CATEGORY_RESPONSE,
  DELETE_PRODUCT_CATEGORY_RESPONSE,
  UNACTIVE_PRODUCT_CATEGORY_RESPONSE,
  ACTIVE_PRODUCT_CATEGORY_RESPONSE,
} from './swagger/product-category.swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Create a new product category',
  })
  @ApiResponse(CREATE_PRODUCT_CATEGORY_RESPONSE)
  @Post()
  async create(
    @Body()
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const data =
      await this.productCategoryService.create(
        createProductCategoryDto,
      );
    return {
      code: SUCCESS_CODES.DATA_CREATED,
      entity: 'Product Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get all product categories',
  })
  @ApiResponse(
    GET_ALL_PRODUCT_CATEGORIES_RESPONSE,
  )
  @Get()
  async findAll() {
    const data =
      await this.productCategoryService.findAll();
    return {
      code: SUCCESS_CODES.DATA_FETCHED,
      entity: 'Product Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get a product category by id',
  })
  @ApiResponse(
    GET_PRODUCT_CATEGORY_BY_ID_RESPONSE,
  )
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data =
      await this.productCategoryService.findOne(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_FETCHED,
      entity: 'Product Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update a product category',
  })
  @ApiResponse(UPDATE_PRODUCT_CATEGORY_RESPONSE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    const data =
      await this.productCategoryService.update(
        +id,
        updateProductCategoryDto,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Product Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Delete a product category',
  })
  @ApiResponse(DELETE_PRODUCT_CATEGORY_RESPONSE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data =
      await this.productCategoryService.remove(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_DELETED,
      entity: 'Product Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Unactive a product category',
  })
  @ApiResponse(UNACTIVE_PRODUCT_CATEGORY_RESPONSE)
  @Patch(':id/unactive')
  async unActiveProductCategory(
    @Param('id') id: string,
  ) {
    const data =
      await this.productCategoryService.unActiveProductCategory(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Product Category',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Active a product category',
  })
  @ApiResponse(ACTIVE_PRODUCT_CATEGORY_RESPONSE)
  @Patch(':id/active')
  async activeProductCategory(
    @Param('id') id: string,
  ) {
    const data =
      await this.productCategoryService.activeProductCategory(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Product Category',
      data,
    };
  }
}
