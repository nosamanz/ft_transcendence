import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { connectedClients } from './chat.gateway';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
	constructor(
		private prisma: PrismaService,
	){}

	// async createUser(nick: string, pass: string): Promise<void> {

	// }
	getHello(msq: string): string
	{
		return("Your(msq): " + msq);
	}

	private async joinCh(userID, chname, channel){
		channel.UserCount++;
		await this.prisma.channel.update({
			where: {Name: chname},
			data: {
				UserCount: channel.UserCount,
				Users: {
					connect: {
						id : userID
					}
		}}});
	}

	private async checkPasswd(userPasswd, channel){
		const channelPasswd = channel.passwd;
		return bcrypt.compare(userPasswd, channelPasswd);
	}

	async createCh(userID, chname, passwd, IsDirect)
	{
		try {
			console.log("123");
			const channel = await this.prisma.channel.findFirst({ where: { Name: chname }});
			if (channel){
				if (!this.checkPasswd(passwd, channel)) { return "Incorrect Password"};
				if (channel.IsInviteOnly && !channel.InvitedIDs.some((element) => element === userID)) {return "You are not invited to this channel."}
				this.joinCh(userID, chname, channel);
			}
			else{
				if (passwd)
				{
					passwd = await bcrypt.hash(passwd, 10);
				}
				await this.prisma.channel.create({
					data: {
						Name: chname,
						Password: passwd,
						ChannelOwnerID: userID,
						AdminIDs: [userID],
						IsDirect: IsDirect,
						IsInviteOnly: false,
						UserCount: 0,
					}
				})
			}
		}catch(error){
			console.log(error);
			return "Error while performing channel operation"}
	}

	private async setAdmin(channel, destuser, chname){
		if ((channel.AdminIDs.some((element) => element === destuser.id)))
			return "Dest User is Already Admin!";
		channel.AdminIDs.push(destuser.id);
		console.log(channel.BannedIDs);
		try{
			await this.prisma.channel.update({
				where: { Name: chname },
				data: { AdminIDs: channel.AdminIDs}
			})
		}
		catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
		return undefined;
	}

	private async ban(channel, destuser, chname){
		if ((channel.BannedIDs.some((element) => element === destuser.id)))
			return "Dest User is Already Banned !";
		channel.BannedIDs.push(destuser.id);
		console.log(channel.BannedIDs);
		try{
			await this.prisma.channel.update({
				where: { Name: chname },
				data: {
					AdminIDs: {
						set: channel.AdminIDs.filter(id => id !== destuser.id)
					},
					BannedIDs: channel.BannedIDs,
					Users: {
						disconnect: {
							id: destuser.id
						}
					}
				}
			})
		}
		catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
	}
	private async kick(channel, destuser, chname){
		try{
			await this.prisma.channel.update({
				where: { Name: chname },
				data: {
					AdminIDs: {
						set: channel.AdminIDs.filter(id => id !== destuser.id)
					},
					Users: {
						disconnect: {
							id: destuser.id
						}
					}
				}
			})
		}catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
	}
	private async mute(channel, destUser, chname)
	{
		if ((channel.MutedIDs.some((element) => element == destUser.id)))
			return "Dest User is Already Muted";
		try{
			channel.MutedIDs.push(destUser.id);
			await this.prisma.channel.update({
				where: {Name: chname},
				data: { MutedIDs: channel.MutedIDs }
			})
		}catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
	}

	async channelOp(userID: number, chname: string , destUser: string, process : string) : Promise<string> {

		// if (process === "createch")
		// {
		// 	const retCh = await this.createCh(userID, chname);
		// 	console.log(retCh);
		// 	return (retCh !== undefined) ? retCh : ("The channel operation successful.")
		// }
		const channel = await this.prisma.channel.findFirst({
			where: {
				Name: chname
			},
			include: {
				Users: true,
			}
		});
		if (!(channel.AdminIDs.some((element) => element === userID)))
		{
			console.log("You are not Channel Admin !");
			return "You are not Channel Admin!";
		}
		const destuser = await channel.Users.find((element) => element.nick == destUser)
		console.log("await destuser -> " + destuser.id);
		if (destuser !== undefined){
			//If i am not channel owner i cant ban this user because he is admin or channelowner but if i am channel owner i can ban.
			if (((channel.AdminIDs.some((element) => element === destuser.id)) || (channel.ChannelOwnerID === destuser.id))
				&& !(channel.ChannelOwnerID === userID))
				return "Dest User is Admin or Channel Owner !";
			else if (process === "ban")
			{
				const retBan = await this.ban(channel, destuser, chname);
				console.log(retBan);
				return (retBan !== undefined) ? retBan : ("The user has been successfully banned.");
			}
			else if (process === "setadmin")
			{
				const retSetAdmin = await this.setAdmin(channel, destuser, chname);
				console.log(retSetAdmin);
				return (retSetAdmin !== undefined) ? retSetAdmin : ("The user has been successfully assigned as admin.");
			}
			else if (process === "kick")
			{
				const retKick = await this.kick(channel, destuser, chname);
				console.log(retKick);
				return (retKick !== undefined) ? retKick : ("The user has been successfully kicked.");
			}
			else if (process === "mute")
			{
				const retMute = await this.mute(channel, destuser, chname);
				console.log(retMute);
				return (retMute !== undefined) ? retMute : ("The user has been successfully muted.");
			}
		}else
		{
			console.log("The User not in the channel");
			return "The User not in the channel";
		}
	}

	async subscribeToChannel(client: Socket, message: string, channelName: string, userID: number): Promise<void> {
		// control edilecek !!
		const channel = await this.prisma.channel.findFirst({
			where: {
				Name: channelName,
			},
			select: {
				Users: {
					select:{
						id: true,
						IgnoredUsers: true,
					}
				},
				MutedIDs: true,
			}
		});
		if(!channel)
		{
			console.log("The channel: " + channelName + " couldn't be found in the database!");
			return;
		}
		const usersOnChat = channel.Users;
		const MutedIDs = channel.MutedIDs;
		usersOnChat.forEach((element) => {
			const socket = this.getSocketByUserID(element.id);
			if(!socket)
			{
				// console.log("Socket to send couldn't be found!");
				return;
			}
			if (!element.IgnoredUsers.some((element) => element.OtherUserID === userID) &&
				!MutedIDs.some((element) => element === userID)
			)
			{
				socket.emit('chat', {message: message, channelName: channelName, senderName: ,senderSocket: client.id});
			}
		});
	}

	async saveMessage(client: Socket, message: string, channelName: string): Promise<void> {

		console.log(message);
		const channel = await this.prisma.channel.findFirst({
			where: {
				Name: channelName
			},
			select: {
				id: true,
				messages: true,
			}
		});
		if(!channel)
		{
			console.log("The channel: " + channelName + " couldn't be found in the database!");
			return;
		}
		const senderID = await this.getUserBySocket(client);
		if(!senderID)
		{
			console.log("Sender information couldn't be found in connected clients list!");
			return;
		}
		console.log(message)
		await this.prisma.message.create({
			data: {
				Content: message,
				SenderID: senderID,
				ChannelID: channel.id
			}
		});
	}

	getUserBySocket(client: Socket): number
	{
		const clientInfo = connectedClients.find((clientInfo) => clientInfo.client === client);
		if (clientInfo)
			return (clientInfo.id);
		return (undefined);
	}

	getSocketByUserID(userID: number): Socket
	{
		const clientInfo = connectedClients.find((clientInfo) => clientInfo.id === userID);
		// console.log(clientInfo);
		if (clientInfo)
			return (clientInfo.client);
		return (undefined);
	}
}
