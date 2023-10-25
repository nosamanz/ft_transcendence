import { Module } from '@nestjs/common';
import { ChatChannelController, ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ChatChannelService } from './chat-channel.service';

@Module({
  controllers: [ChatController, ChatChannelController],
  providers: [ChatService, PrismaService, UserService,JwtService, ChatChannelService]
})
export class ChatModule {

}
