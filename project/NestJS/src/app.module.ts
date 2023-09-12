import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthanticatorModule } from './twofactorauth/authanticator.module';
import { AuthanticatorService } from './twofactorauth/authanticator.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
  ChatModule,
  AuthModule,
  UserModule,
  PrismaModule,
  AuthanticatorModule,
  JwtModule],
  controllers: [AppController],
  providers: [UserService, ChatGateway, ChatService, AuthService, PrismaService, AuthanticatorService, JwtService],
})
export class AppModule {}
