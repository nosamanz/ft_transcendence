import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllChat } from '../entities/AllChat.entity';
import { PrivChat } from '../entities/PrivChat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaService, UserService,JwtService]
})
export class ChatModule {

}
