import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SUCCESS_CODES } from 'src/common/constants/response.constants';
import {
  REGISTRATION_RESPONSE,
  REGISTRATION_VALIDATION_ERROR,
  REGISTRATION_CONFLICT_ERROR,
  LOGIN_SUCCESS,
  LOGIN_UNAUTHORIZED,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_UNAUTHORIZED,
} from './swagger/auth.swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiResponse(REGISTRATION_RESPONSE)
  @ApiResponse(REGISTRATION_VALIDATION_ERROR)
  @ApiResponse(REGISTRATION_CONFLICT_ERROR)
  async register(
    @Body() registrationDto: RegistrationDto,
  ) {
    const data = await this.authService.register(
      registrationDto,
    );

    return {
      code: SUCCESS_CODES.REGISTRATION_SUCCESS,
      entity: 'User',
      data,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse(LOGIN_SUCCESS)
  @ApiResponse(LOGIN_UNAUTHORIZED)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary:
      'Refresh access token using refresh token',
  })
  @ApiResponse(REFRESH_TOKEN_SUCCESS)
  @ApiResponse(REFRESH_TOKEN_UNAUTHORIZED)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(
      refreshTokenDto,
    );
  }
}
