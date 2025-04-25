import { Module } from '@nestjs/common';
import { AppController } from './modules/introduction/app.controller';
import { AppService } from './modules/introduction/app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { StoreCategoryModule } from './modules/store-category/store-category.module';
import { StoreSellerModule } from './modules/store-seller/store-seller.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { StoreProductModule } from './modules/store-product/store-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    StoreCategoryModule,
    StoreSellerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // The URL prefix
    }),
    ProductCategoryModule,
    StoreProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
