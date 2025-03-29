import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify Your Email',
        template: 'verification',
        context: {
          code,
          appName: this.configService.get(
            'APP_NAME',
            'E-Commerce',
          ),
          validityPeriod: '15 minutes',
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to send verification email: ${error.message}`,
      );
    }
  }

  async sendWelcomeEmail(
    email: string,
    username: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to E-Commerce',
        template: 'welcome',
        context: {
          username,
          appName: this.configService.get(
            'APP_NAME',
            'E-Commerce',
          ),
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to send welcome email: ${error.message}`,
      );
    }
  }
}
