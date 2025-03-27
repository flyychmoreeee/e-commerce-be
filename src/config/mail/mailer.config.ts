import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const mailerConfig = (
  configService: ConfigService,
): MailerOptions => ({
  transport: {
    host: configService.get<string>('MAIL_HOST'),
    port: configService.get<number>('MAIL_PORT'),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: configService.get<string>(
        'MAIL_USER',
      ),
      pass: configService.get<string>(
        'MAIL_PASSWORD',
      ),
    },
  },
  defaults: {
    from: `"${configService.get('MAIL_FROM_NAME')}" <${configService.get('MAIL_FROM')}>`,
  },
  template: {
    dir: join(
      process.cwd(),
      'src/templates/mail',
    ),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
      partials: {
        dir: join(
          __dirname,
          '../../templates/mail/partials',
        ),
      },
      layouts: {
        dir: join(
          __dirname,
          '../../templates/mail/layouts',
        ),
        default: 'main',
      },
    },
  },
  preview: true,
});
