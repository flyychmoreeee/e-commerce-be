import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Welcome endpoint',
    description:
      'Returns welcome message for the E-Commerce API',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    schema: {
      example: {
        message: 'Welcome to E-Commerce API',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
