import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatChannelService {
	constructor(
		private prisma: PrismaService,
	){}

	private async joinCh(userID, chname, channel){
		await this.prisma.channel.update({
			where:	{ Name: chname },
			data:	{ Users: { connect: { id : userID }}}
		});
	}

	private async checkPasswd(userPasswd, channel): Promise<boolean> {
		//check for brypt
		if (channel.Password === undefined)
			return true;
		const channelPasswd = channel.Password;
		return await bcrypt.compare(userPasswd, channelPasswd);
	}

	async createCh(userID, chname, passwd, isDirect)
	{
		try {
			const channel = await this.prisma.channel.findFirst({ where: { Name: chname }});
			if (channel){
				if (await this.checkPasswd(passwd, channel) === false) { return "Incorrect Password"};
				if (channel.IsInviteOnly && !channel.InvitedIDs.some((element) => element === userID)) {return "You are not invited to this channel."}
				this.joinCh(userID, chname, channel);
			}
			else{
				if (passwd !== "undefined")
				{
					passwd = await bcrypt.hash(passwd, 10);
					console.log(passwd);
				}
				await this.prisma.channel.create({
					data: {
						Name: chname,
						Password: passwd,
						ChannelOwnerID: userID,
						AdminIDs: [userID],
						IsDirect: isDirect,
						IsInviteOnly: false,
						Users : { connect: { id : userID } }
					},
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
		let status: string;
		try{
			if ((channel.MutedIDs.some((element) => element == destUser.id)))
			{
				channel.MutedIDs = channel.MutedIDs.filter(element => element !== destUser.id);
				status = "The User Unmuted.";
			}
			else { channel.MutedIDs.push(destUser.id)};
			await this.prisma.channel.update({
				where: {Name: chname},
				data: { MutedIDs: channel.MutedIDs }
			})
			return status;
		}catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
	}

	async channelOp(userID: number, chname: string , destUser: string, process : string) : Promise<string>
	{
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
				return (retMute !== undefined) ? retMute : ("The user has been successfully muted."); //mute&unmute
			}
		}else
		{
			console.log("The User not in the channel");
			return "The User not in the channel";
		}
	}
}
