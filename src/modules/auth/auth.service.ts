import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
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
  SUCCESS_CODES,
} from '../../common/constants/response.constants';
import { MailService } from '../mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private generateOTP(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  private generateTokens(payload: {
    sub: number;
    email: string;
  }) {
    return Promise.all([
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>(
            'JWT_SECRET',
          ),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
        ),
        expiresIn: '7d',
      }),
    ]);
  }

  async sendVerificationCode(email: string) {
    try {
      const verificationCode = this.generateOTP();
      const verificationExpires = new Date(
        Date.now() + 15 * 60 * 1000,
      ); // 15 menit

      // Cek apakah email sudah terdaftar dan terverifikasi
      const existingUser =
        await this.prisma.user.findUnique({
          where: { email },
          select: { isVerified: true },
        });

      if (existingUser?.isVerified) {
        throw new ConflictException({
          code: ERROR_CODES.EMAIL_ALREADY_VERIFIED,
          error_message: 'Email already verified',
        });
      }

      // Simpan atau update kode verifikasi
      await this.prisma.user.upsert({
        where: { email },
        create: {
          email,
          verificationCode,
          verificationExpires,
          username: '', // temporary
          password: '', // temporary
          role: 'BUYER',
        },
        update: {
          verificationCode,
          verificationExpires,
        },
      });

      // Kirim email verifikasi
      await this.mailService.sendVerificationEmail(
        email,
        verificationCode,
      );

      return {
        success: true,
        message:
          'Verification code sent successfully',
        code: SUCCESS_CODES.VERIFICATION_SENT,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: ERROR_CODES.APP_SERVER_ERROR,
        error_message:
          ERROR_MESSAGES[
            ERROR_CODES.APP_SERVER_ERROR
          ],
      });
    }
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ) {
    const { email, code } = verifyEmailDto;

    const user =
      await this.prisma.user.findUnique({
        where: { email },
      });

    if (!user || user.verificationCode !== code) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_VERIFICATION_CODE,
        error_message:
          'Invalid verification code',
      });
    }

    if (
      user.verificationExpires &&
      user.verificationExpires < new Date()
    ) {
      throw new UnauthorizedException({
        code: ERROR_CODES.VERIFICATION_EXPIRED,
        error_message:
          'Verification code has expired',
      });
    }

    // Update user dan generate tokens
    const updatedUser =
      await this.prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          verificationCode: null,
          verificationExpires: null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

    // Generate tokens
    const [accessToken, refreshToken] =
      await this.generateTokens({
        sub: updatedUser.id,
        email: updatedUser.email,
      });

    // Simpan refresh token
    await this.prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken },
    });

    // Kirim email selamat datang
    await this.mailService.sendWelcomeEmail(
      email,
      updatedUser.username,
    );

    return {
      success: true,
      message:
        'Registration completed successfully',
      code: SUCCESS_CODES.REGISTRATION_SUCCESS,
      data: {
        accessToken,
        refreshToken,
        user: updatedUser,
      },
    };
  }

  async register(
    registrationDto: RegistrationDto,
  ) {
    try {
      const { email, username, password } =
        registrationDto;

      // Cek email sudah terdaftar
      const existingUser =
        await this.prisma.user.findUnique({
          where: { email },
        });

      if (existingUser?.isVerified) {
        throw new ConflictException({
          code: ERROR_CODES.EMAIL_ALREADY_VERIFIED,
          error_message:
            'Email already registered',
        });
      }

      // Cek username unik
      const existingUsername =
        await this.prisma.user.findUnique({
          where: { username },
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

      // Generate OTP dan hash password
      const verificationCode = this.generateOTP();
      const verificationExpires = new Date(
        Date.now() + 15 * 60 * 1000,
      ); // 15 menit
      const hashedPassword = await bcrypt.hash(
        password,
        10,
      );

      // Buat atau update user
      const user = await this.prisma.user.upsert({
        where: { email },
        create: {
          email,
          username,
          password: hashedPassword,
          verificationCode,
          verificationExpires,
          isVerified: false,
          role: 'BUYER',
        },
        update: {
          username,
          password: hashedPassword,
          verificationCode,
          verificationExpires,
        },
      });

      // Kirim email verifikasi
      await this.mailService.sendVerificationEmail(
        email,
        verificationCode,
      );

      return {
        success: true,
        message:
          'Registration pending. Please check your email for verification code',
        code: SUCCESS_CODES.REGISTRATION_PENDING,
        data: {
          email,
          username,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: ERROR_CODES.APP_SERVER_ERROR,
        error_message:
          ERROR_MESSAGES[
            ERROR_CODES.APP_SERVER_ERROR
          ],
      });
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

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException({
        code: ERROR_CODES.GOOGLE_AUTH_FAILED,
        error_message: 'No user from google',
      });
    }

    try {
      // Cek apakah user sudah terdaftar
      let dbUser =
        await this.prisma.user.findUnique({
          where: { email: user.email },
        });

      if (!dbUser) {
        // Buat user baru jika belum terdaftar
        const username = `${user.firstName}${Math.random().toString(36).slice(-4)}`;
        dbUser = await this.prisma.user.create({
          data: {
            email: user.email,
            username,
            isVerified: true, // Email dari Google sudah terverifikasi
            role: 'BUYER',
            password: '',
            googleId: user.id,
            picture: user.picture,
          },
        });
      }

      // Generate tokens
      const [accessToken, refreshToken] =
        await this.generateTokens({
          sub: dbUser.id,
          email: dbUser.email,
        });

      // Update refresh token
      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: { refreshToken },
      });

      return {
        success: true,
        code: SUCCESS_CODES.GOOGLE_LOGIN_SUCCESS,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.username,
            role: dbUser.role,
            picture: dbUser.picture,
          },
        },
      };
    } catch (error) {
      if (
        error instanceof
        InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: ERROR_CODES.GOOGLE_AUTH_ERROR,
        error_message:
          ERROR_MESSAGES[
            ERROR_CODES.GOOGLE_AUTH_ERROR
          ],
      });
    }
  }
}
