import { Controller, Get, UseGuards, Post , Body, Res, Param, Req} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as path from 'path'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private prisma: PrismaService,
        private userService: UserService,
    ){}

    @Get()
    getChat(@Res() response: Response) {
      const filePath = path.join(__dirname, '..', '..', '..', 'Front', 'html', 'chatting.html');
      return response.sendFile(filePath);
    }

    @Get('/:channelName/messages')
    @UseGuards(JwtGuard)
    async getMessages(@Res() response: Response, @Req() req: Request, @Param('channelName') chname: string){
      const userID: number = parseInt(req.body.toString(), 10);
	    // const user = await this.userService.getUserByID(userID, true);

      //Lets find Channel
      const channel = await this.prisma.channel.findFirst({
        where: {
          Name: chname,
        },
        select: {
          messages: true,//order
          Users: {
            where: {
              id: userID
            },
            select: {
              id: true,
              IgnoredUsers: true,
            }
          },
          BannedIDs: true,
          MutedIDs: true,
        }
      });
      let messages = channel.messages;
      let TheUser = channel.Users[0];
      channel.messages.forEach((message) => console.log("Mes: "+ message.SenderID + "  " + message.Content))
      // console.log("Channel " + channel.messages);
      TheUser.IgnoredUsers.forEach((IgnoredUsers) => console.log("Ignored: "+ IgnoredUsers.OtherUserID))
      channel.BannedIDs.forEach((id) => console.log("Banned: "+ id))
      channel.MutedIDs.forEach((id) => console.log("Muted: "+ id))
      messages = messages.filter(
        message => (
          message.SenderID !== channel.MutedIDs.find((element) => element === message.SenderID) &&
          message.SenderID !== channel.BannedIDs.find((element) => element === message.SenderID) &&
          message.SenderID !== (TheUser.IgnoredUsers.find((element) => element.OtherUserID === message.SenderID) !== undefined ? TheUser.IgnoredUsers.find((element) => element.OtherUserID === message.SenderID).OtherUserID: undefined)
          )
          )
      messages.forEach((message) => console.log("Mes Send: "+ message.SenderID + "  " + message.Content))
      return response.send(messages);
      //Check
      // const messages = await this.prisma.user.findMany()

    }
    // @Post()
	  // async createUser(@Body('msg') msg: string) {
		// console.log("From Controller: " + msg);
  	// }
}
