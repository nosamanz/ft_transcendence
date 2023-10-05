import { Controller, Get, UseGuards, Post , Body, Res, Param, Req} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { response, Response } from 'express';
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
		// TheUser.IgnoredUsers.forEach((IgnoredUsers) => console.log("Ignored: "+ IgnoredUsers.OtherUserID))
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
	@Get('/:channelName/setAdmin/:user')
	@UseGuards(JwtGuard)
	async getNewAdmin(@Req() req: Request, @Res() res: Response, @Param('user') destUser: string, @Param('channelName') chname:string){
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatService.channelControls(userID, chname, destUser, "setadmin"));
	}
	@Get('/:channelName/kick/:user')
	@UseGuards(JwtGuard)
	async getKickedUser(@Req() req: Request, @Res() res: Response, @Param('user') destUser: string, @Param('channelName') chname: string){
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatService.channelControls(userID, chname, destUser, "kick"));
	}
	@Get('/:channelName/mute/:user')
	@UseGuards(JwtGuard)
	async getMutedUser(@Req() req: Request, @Res() res: Response, @Param('user') destUser: string, @Param('channelName') chname : string){
		const userID: number = parseInt(req.body.toString(), 10);
		return res.send(await this.chatService.channelControls(userID, chname, destUser, "mute"));
	}
	@Get('/:channelName/ban/:user')
	@UseGuards(JwtGuard)
	async getBannedUser(@Req() req: Request, @Res() res: Response, @Param('user') destUser: string, @Param('channelName') chname:string){
		const userID: number = parseInt(req.body.toString(), 10);
		//check is user admin and the kicked user mustn't be a channel owner
		// const channel = await this.prisma.channel.findFirst({ where: { Name: chname,}})
		return res.send(await this.chatService.channelControls(userID, chname, destUser, "ban"));
	}

	
	// @Post()
	// async createUser(@Body('msg') msg: string) {
		// console.log("From Controller: " + msg);
		// }
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
