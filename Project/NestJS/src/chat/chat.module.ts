import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllChat } from '../entities/AllChat.entity';
import { PrivChat } from '../entities/PrivChat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';


@Module({
  imports: [TypeOrmModule.forFeature([AllChat]), TypeOrmModule.forFeature([PrivChat])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {

}
