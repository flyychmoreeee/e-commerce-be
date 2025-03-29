import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Req,
  UseGuards,
  Get,
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
import {
  SendVerificationDto,
  VerifyEmailDto,
} from './dto/verify-email.dto';
import {
  REGISTRATION_RESPONSE,
  REGISTRATION_VALIDATION_ERROR,
  REGISTRATION_CONFLICT_ERROR,
  LOGIN_SUCCESS,
  LOGIN_UNAUTHORIZED,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_UNAUTHORIZED,
  GOOGLE_LOGIN_ERROR,
  GOOGLE_LOGIN_SUCCESS,
} from './swagger/auth.swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ERROR_CODES } from 'src/common/constants/response.constants';
import { AuthGuard } from '@nestjs/passport';

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
    return await this.authService.register(
      registrationDto,
    );
  }

  @Post('send-verification')
  @Public()
  @ApiOperation({
    summary: 'Send email verification code',
  })
  async sendVerificationCode(
    @Body()
    sendVerificationDto: SendVerificationDto,
  ) {
    return this.authService.sendVerificationCode(
      sendVerificationDto.email,
    );
  }

  @Post('verify-email')
  @Public()
  @ApiOperation({
    summary: 'Verify email with OTP code',
  })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ) {
    try {
      const result =
        await this.authService.verifyEmail(
          verifyEmailDto,
        );

      // Pastikan token ada dalam response
      if (
        !result.data?.accessToken ||
        !result.data?.refreshToken
      ) {
        throw new InternalServerErrorException({
          code: ERROR_CODES.TOKEN_GENERATION_FAILED,
          error_message:
            'Failed to generate authentication tokens',
        });
      }

      return result;
    } catch (error) {
      // Log error untuk debugging
      console.error('Verification error:', error);
      throw error;
    }
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Initiate Google OAuth2 login',
  })
  @ApiResponse(GOOGLE_LOGIN_SUCCESS)
  @ApiResponse(GOOGLE_LOGIN_ERROR)
  async googleAuth() {
    // Trigger Google OAuth2
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
}
