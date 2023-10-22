import { Controller, Get, UseGuards, Body, Res, Param, Req, ParseBoolPipe, Query, ParseIntPipe} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { connectedClients } from './chat.gateway';
import { ChatChannelService } from './chat-channel.service';

@Controller('chat')
export class ChatController {
	constructor(
			private chatService: ChatService,
			private chatChannelService: ChatChannelService,
			private prisma: PrismaService,
			private userService: UserService,
	){}

	@Get('/:channelName/messages')
	@UseGuards(JwtGuard)
	async getMessages(
		@Res() response: Response,
		@Req() req: Request,
		@Param('channelName') chname: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);
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

		channel.messages.forEach((message) => console.log("Mes: "+ message.senderID + "  " + message.message))
		channel.BannedIDs.forEach((id) => console.log("Banned: "+ id))
		channel.MutedIDs.forEach((id) => console.log("Muted: "+ id))

		messages = messages.filter(
			message => (
				message.senderID !== channel.MutedIDs.find((element) => element === message.senderID) &&
				message.senderID !== channel.BannedIDs.find((element) => element === message.senderID)
				// message.senderID !== user.IgnoredUsers.some((element) => element.OtherUserID === message.senderID)!!!
					)
				)
		messages.forEach((message) => console.log("Mes Send: "+ message.senderID + "  " + message.message))
		return response.send(messages);
	}

	@Get('/:channelName/setAdmin/:user')
	@UseGuards(JwtGuard)
	async getNewAdmin(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') destUser: string,
		@Param('channelName') chname:string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatChannelService.channelOp(userID, chname, destUser, "setadmin"));
	}

	@Get('/:channelName/kick/:user')
	@UseGuards(JwtGuard)
	async getKickedUser(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') destUser: string,
		@Param('channelName') chname: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatChannelService.channelOp(userID, chname, destUser, "kick"));
	}

	@Get('/:channelName/mute/:user')
	@UseGuards(JwtGuard)
	async getMutedUser(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') destUser: string,
		@Param('channelName') chname : string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatChannelService.channelOp(userID, chname, destUser, "mute"));
	}

	@Get('/:channelName/ban/:user')
	@UseGuards(JwtGuard)
	async getBannedUser(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') destUser: string,
		@Param('channelName') chname:string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatChannelService.channelOp(userID, chname, destUser, "ban"));
	}

	@Get('/:channelName/create/:isDirect/:passwd')
	@UseGuards(JwtGuard)
	async getChannel(
		@Req() req: Request,
		@Res() res: Response,
		@Param('channelName') chname: string,
		@Param('isDirect', new ParseBoolPipe()) isDirect : boolean,
		@Param('passwd') passwd: string
	){
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatChannelService.createCh(userID, chname, passwd, isDirect));
	}

	// '/:channelName/inviteChannel'
	//

	@Get('connect')
    @UseGuards(JwtGuard)
    bindSocket(@Req() req: Request): void
	{
      const userID: number = parseInt(req.body.toString(), 10);
      const socketID: string = req.headers['socket-id'];
      if(!socketID || !userID)
      {
        console.log("SocketID or UserID couldn't find!");
        return;
      }
      const indexToUpdate = connectedClients.findIndex((clientInfo) => clientInfo.client.id === socketID);

      if (indexToUpdate === -1) {
        console.log("Client id couldn't be bind with userID!");
        return;
      }
      console.log("UserID: " + userID +" binded with socket " + socketID);
      connectedClients[indexToUpdate].id = userID;
      }
	}
