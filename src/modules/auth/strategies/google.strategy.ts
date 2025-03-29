import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService, // Tambahkan PrismaService
  ) {
    super({
      clientID:
        configService.get<string>(
          'GOOGLE_CLIENT_ID',
        ) || '',
      clientSecret:
        configService.get<string>(
          'GOOGLE_CLIENT_SECRET',
        ) || '',
      callbackURL:
        configService.get<string>(
          'GOOGLE_CALLBACK_URL',
        ) || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { name, emails, photos } = profile;
      const email = emails?.[0]?.value;

      // Cek apakah user sudah ada di database
      let user =
        await this.prisma.user.findUnique({
          where: { email },
        });

      if (!user) {
        // Buat user baru jika belum ada
        const username = `${name?.givenName}${Math.random().toString(36).slice(-4)}`;
        user = await this.prisma.user.create({
          data: {
            email: email || '',
            username,
            googleId: profile.id,
            picture: photos?.[0]?.value,
            password: '',
            isVerified: true,
            role: 'BUYER',
          },
        });
      } else if (!user.googleId) {
        // Update user dengan googleId jika belum ada
        user = await this.prisma.user.update({
          where: { email },
          data: {
            googleId: profile.id,
            picture: photos?.[0]?.value,
          },
        });
      }

      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        picture: user.picture,
        role: user.role,
        accessToken,
        googleId: profile.id,
      };

      done(null, userData);
    } catch (error) {
      done(error, undefined);
    }
  }
}
