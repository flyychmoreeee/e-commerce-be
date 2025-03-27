import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { mailerConfig } from 'src/config/mail/mailer.config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [MailerModule, MailService],
  providers: [MailService],
})
export class MailModule {}
