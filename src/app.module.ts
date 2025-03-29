import { Module } from '@nestjs/common';
import { AppController } from './modules/introduction/app.controller';
import { AppService } from './modules/introduction/app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { StoreCategoryModule } from './modules/store-category/store-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    StoreCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
