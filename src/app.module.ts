import { Module } from '@nestjs/common';
import { AppController } from './modules/introduction/app.controller';
import { AppService } from './modules/introduction/app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
