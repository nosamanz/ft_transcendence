import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
	constructor(
		private prisma: PrismaService,
	){}

	async createUser(nick: string, pass: string): Promise<void> {

	}
	getHello(msq: string): string
	{
		return("Your(msq): " + msq);
	}


	private async setAdmin(channel, destuser, chname){
		// if ((channel.AdminIDs.some((element) => element === destuser.id)))
		// 	return "Dest User is Already Admin!";
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
			this.prisma.$disconnect();
		}
		catch(error){
			console.log("Error ! While channel updating");
		}
	}
	async channelControls(userID: number, chname: string , destUser ?: string, process ?: string) : Promise<string> {
		const channel = await this.prisma.channel.findFirst({ where: { Name: chname,}});
		//
		//Is User On Channel ?
		//
		if (!(channel.AdminIDs.some((element) => element === userID)))
			return "You are not Channel Admin!";
		if (destUser)
		{
			const destuser = await this.prisma.user.findFirst({ where: { nick: destUser } })
			//If i am not channel owner i cant ban this user because he is admin or channelowner but if i am channel owner i can ban.
			if (((channel.AdminIDs.some((element) => element === destuser.id)) || (channel.ChannelOwnerID === destuser.id))
				&& !(channel.ChannelOwnerID === userID))
				return "Dest User is Admin or Channel Owner !";
			if (process === "ban")
			{
				const banRet = await this.ban(channel, destuser, chname);
				if (banRet !== undefined)
					return banRet;
			}
			else if (process === "setadmin")
			{
				const retSetAdmin = await this.setAdmin(channel, destuser, chname);
				if (retSetAdmin !== undefined)
					return retSetAdmin;
			}
		}
		return undefined;
	}
}
