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
import { StoreProductService } from './store-product.service';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
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
import { Public } from 'src/common/decorators/public.decorator';
import {
  CREATE_STORE_PRODUCT_RESPONSE,
  GET_ALL_STORE_PRODUCTS_RESPONSE,
  GET_STORE_PRODUCT_BY_ID_RESPONSE,
  GET_STORE_PRODUCT_BY_STORE_ID_RESPONSE,
  UPDATE_STORE_PRODUCT_RESPONSE,
} from './swagger/store-product.swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('store-product')
export class StoreProductController {
  constructor(
    private readonly storeProductService: StoreProductService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @ApiOperation({
    summary: 'Create a new store product',
  })
  @ApiResponse(CREATE_STORE_PRODUCT_RESPONSE)
  @Post()
  async create(
    @Body()
    createStoreProductDto: CreateStoreProductDto,
  ) {
    const data =
      await this.storeProductService.create(
        createStoreProductDto,
      );
    return {
      code: SUCCESS_CODES.DATA_CREATED,
      entity: 'Store Product',
      data,
    };
  }

  @Public()
  @ApiOperation({
    summary: 'Get all store products',
  })
  @ApiResponse(GET_ALL_STORE_PRODUCTS_RESPONSE)
  @Get()
  async findAll() {
    const data =
      await this.storeProductService.findAll();
    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store Product',
      data,
    };
  }

  @Public()
  @ApiOperation({
    summary: 'Get a store product by id',
  })
  @ApiResponse(GET_STORE_PRODUCT_BY_ID_RESPONSE)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data =
      await this.storeProductService.findOne(+id);
    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store Product',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @ApiOperation({
    summary: 'Update a store product',
  })
  @ApiResponse(UPDATE_STORE_PRODUCT_RESPONSE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateStoreProductDto: UpdateStoreProductDto,
  ) {
    const data =
      await this.storeProductService.update(
        +id,
        updateStoreProductDto,
      );
    return {
      code: SUCCESS_CODES.DATA_UPDATED,
      entity: 'Store Product',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @ApiOperation({
    summary: 'Delete a store product',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data =
      await this.storeProductService.remove(+id);
    return {
      code: SUCCESS_CODES.DATA_DELETED,
      entity: 'Store Product',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.SELLER)
  @ApiOperation({
    summary: 'Get all store products by store id',
  })
  @ApiResponse(
    GET_STORE_PRODUCT_BY_STORE_ID_RESPONSE,
  )
  @Get('store/:id')
  async getProductByStoreId(
    @Param('id') id: string,
  ) {
    const data =
      await this.storeProductService.getProductByStoreId(
        +id,
      );
    return {
      code: SUCCESS_CODES.DATA_FOUND,
      entity: 'Store Product',
      data,
    };
  }
}
