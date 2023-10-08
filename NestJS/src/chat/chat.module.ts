import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, PrismaService, UserService,JwtService]
})
export class ChatModule {

}
