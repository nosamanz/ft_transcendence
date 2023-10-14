import { Controller, Get, UseGuards, Post , Body, Res, Param, Req} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import * as path from 'path'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { connectedClients } from './chat.gateway';
import * as bcrypt from 'bcrypt';

export let hashed1: string = "";
export let hashed2: string = "";

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
	async getMessages(
		@Res() response: Response,
		@Req() req: Request,
		@Param('channelName') chname: string)
	{
		console.log("-------------------->");
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
		return res.send(await this.chatService.channelOp(userID, chname, destUser, "setadmin"));
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
		return res.send(await this.chatService.channelOp(userID, chname, destUser, "kick"));
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
		return res.send(await this.chatService.channelOp(userID, chname, destUser, "mute"));
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
		return res.send(await this.chatService.channelOp(userID, chname, destUser, "ban"));
	}

	@Get('/:channelName/create/:isDirect/:passwd')
	@UseGuards(JwtGuard)
	async getChannel(
		@Req() req: Request,
		@Res() res: Response,
		@Param('channelName') chname: string,
		@Param('isDirect') isDirect: Boolean,
		@Param('passwd') passwd: string)
	{
		let IsDirect = Boolean(isDirect);
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatService.createCh(userID, chname, passwd, IsDirect));
	}

	// @Post()
	// async createUser(@Body('msg') msg: string) {
		// console.log("From Controller: " + msg);
		// }


	@Get('connect')
    @UseGuards(JwtGuard)
    bindSocket(@Req() req: Request): void
	{
      const userID: number = parseInt(req.body.toString(), 10);
      const socketID: string = req.headers['socket-id'];
	//   console.log("socketID ----> " + socketID);
	//   console.log("userID 	----> " + userID);
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

	// if (!(channel.AdminIDs.some((element) => element === userID)))
	// {
	// 	console.log("You are not Channel Admin !");
	// 	res.send("You are not Channel Admin !");
	// 	return res.send("You are not Channel Admin !");
	// }
	// const destuser = await this.prisma.user.findFirst({ where: { nick: destUser } })
	// console.log(destuser.id);
	// if ((channel.AdminIDs.some((element) => element === destuser.id)) || (channel.ChannelOwnerID === destuser.id))
	// {
	// 	console.log("Dest user is Admin or Channel Owner!");
	// 	return res.send("Dest user is Admin !");
	// }
	// else if ((channel.BannedIDs.some((element) => element === destuser.id)))
	// {
	// 	console.log("Dest User Already Banned !");
	// 	return;
	// }
	// channel.BannedIDs.push(destuser.id);
	// console.log(channel.BannedIDs);
	// try{
	// 	await this.prisma.channel.update({
	// 		where: { Name: chname },
	// 		data: { BannedIDs: channel.BannedIDs}
	// 	})
	// }
	// catch(error){
	// 	console.log("Error ! While channel updating");
	// }
