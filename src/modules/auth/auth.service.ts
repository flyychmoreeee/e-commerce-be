import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../../common/constants/response.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registrationDto: RegistrationDto,
  ) {
    try {
      // Check if email already exists
      const existingUser =
        await this.prisma.user.findUnique({
          where: {
            email: registrationDto.email,
          },
        });

      if (existingUser) {
        throw new ConflictException({
          code: ERROR_CODES.CONFLICT,
          error_message:
            ERROR_MESSAGES[ERROR_CODES.CONFLICT](
              'Email',
            ),
          details: {
            field: 'email',
            message: 'Email already exists',
          },
        });
      }

      // Check if username already exists
      const existingUsername =
        await this.prisma.user.findUnique({
          where: {
            username: registrationDto.username,
          },
        });

      if (existingUsername) {
        throw new ConflictException({
          code: ERROR_CODES.CONFLICT,
          error_message:
            ERROR_MESSAGES[ERROR_CODES.CONFLICT](
              'Username',
            ),
          details: {
            field: 'username',
            message: 'Username already exists',
          },
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        registrationDto.password,
        10,
      );

      // Create user
      const user = await this.prisma.user.create({
        data: {
          ...registrationDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Generate tokens
      const payload = {
        sub: user.id,
        email: user.email,
      };

      const [accessToken, refreshToken] =
        await Promise.all([
          this.jwtService.signAsync(payload, {
            secret:
              this.configService.get<string>(
                'JWT_SECRET',
              ),
            expiresIn: '15m',
          }),
          this.jwtService.signAsync(payload, {
            secret:
              this.configService.get<string>(
                'JWT_REFRESH_SECRET',
              ),
            expiresIn: '7d',
          }),
        ]);

      // Store refresh token
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      // Find user by email
      const user =
        await this.prisma.user.findUnique({
          where: {
            email: loginDto.email,
          },
        });

      if (!user) {
        throw new UnauthorizedException({
          code: ERROR_CODES.INVALID_CREDENTIALS,
          error_message:
            ERROR_MESSAGES[
              ERROR_CODES.INVALID_CREDENTIALS
            ],
        });
      }

      // Verify password
      const isPasswordValid =
        await bcrypt.compare(
          loginDto.password,
          user.password,
        );

      if (!isPasswordValid) {
        throw new UnauthorizedException({
          code: ERROR_CODES.INVALID_CREDENTIALS,
          error_message:
            ERROR_MESSAGES[
              ERROR_CODES.INVALID_CREDENTIALS
            ],
        });
      }

      // Generate tokens
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const [accessToken, refreshToken] =
        await Promise.all([
          this.jwtService.signAsync(payload, {
            secret:
              this.configService.get<string>(
                'JWT_SECRET',
              ),
            expiresIn: '15m', // Access token expires in 15 minutes
          }),
          this.jwtService.signAsync(payload, {
            secret:
              this.configService.get<string>(
                'JWT_REFRESH_SECRET',
              ),
            expiresIn: '7d', // Refresh token expires in 7 days
          }),
        ]);

      // Store refresh token in database
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ) {
    try {
      // Verify refresh token
      const payload =
        await this.jwtService.verifyAsync(
          refreshTokenDto.refreshToken,
          {
            secret:
              this.configService.get<string>(
                'JWT_REFRESH_SECRET',
              ),
          },
        );

      // Find user and check if refresh token matches
      const user =
        await this.prisma.user.findUnique({
          where: { id: payload.sub },
        });

      if (
        !user ||
        user.refreshToken !==
          refreshTokenDto.refreshToken
      ) {
        throw new UnauthorizedException({
          code: ERROR_CODES.INVALID_REFRESH_TOKEN,
          error_message:
            ERROR_MESSAGES[
              ERROR_CODES.INVALID_REFRESH_TOKEN
            ],
        });
      }

      // Generate new tokens
      const newPayload = {
        sub: user.id,
        email: user.email,
      };

      const [newAccessToken, newRefreshToken] =
        await Promise.all([
          this.jwtService.signAsync(newPayload, {
            secret:
              this.configService.get<string>(
                'JWT_SECRET',
              ),
            expiresIn: '15m',
          }),
          this.jwtService.signAsync(newPayload, {
            secret:
              this.configService.get<string>(
                'JWT_REFRESH_SECRET',
              ),
            expiresIn: '7d',
          }),
        ]);

      // Update refresh token in database
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_REFRESH_TOKEN,
        error_message:
          ERROR_MESSAGES[
            ERROR_CODES.INVALID_REFRESH_TOKEN
          ],
      });
    }
  }
}
