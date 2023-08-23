import { Controller, Get, Param, Post , Body, Res} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import * as path from 'path'

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}

    @Get()
    getChat(@Res() response: Response) {
      const filePath = path.join(__dirname, '..', '..', '..', 'Front', 'html', 'chatting.html');
      return response.sendFile(filePath);
    }

    @Post()
	  async createUser(@Body('msg') msg: string) {
		console.log("From Controller: " + msg);
  	}
}
