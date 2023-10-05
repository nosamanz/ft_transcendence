import { Injectable } from '@nestjs/common';
import { find } from 'rxjs';
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
	async channelControls(userID: number, chname: string , destUser : string, process : string) : Promise<string> {
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
			if (process === "ban")
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
}
