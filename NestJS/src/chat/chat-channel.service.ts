import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatChannelService {
	constructor(
		private prisma: PrismaService,
	){}


	private async joinCh(userID, chname){
		const channel = await this.prisma.channel.update({
			where:  { Name: chname },
			data:   { Users: { connect: { id : userID }}}
		});
		return channel;
	}

	private async checkPasswd(userPasswd, channel): Promise<boolean> {
		//check for brypt
		if (channel.Password === "undefined")
		return true;
		const channelPasswd = channel.Password;
		return await bcrypt.compare(userPasswd, channelPasswd);
	}

async leaveChannel(chname: string, userID: number)
{
	try {
		const channel = await this.prisma.channel.update({
				where: { Name: chname },
				data: { Users: { disconnect: { id : userID } } },
				include: { Users: true },
			})

			if (channel.Users.length === 0)
			{
				await this.prisma.message.deleteMany({
					where: { channelName: chname },
				})
				await this.prisma.channel.delete({
					where: { Name: chname },
				})
				return;
			}

			if ( channel.AdminIDs.some( element => element === userID ))
			{
				let data: any;
				const adminId = channel.AdminIDs.filter( element => element !== userID );
				if (channel.AdminIDs.length > 1) {
					if (channel.ChannelOwnerID === userID)
					data = { AdminIDs: adminId, ChannelOwnerID: adminId[0]}
				else
				data = { AdminIDs: adminId };
		}
		else {
			if (channel.ChannelOwnerID === userID)
			data = { AdminIDs: [channel.Users[0].id] , ChannelOwnerID: channel.Users[0].id };
		else
		data = { AdminIDs: [channel.Users[0].id] };
}
await this.prisma.channel.update({
	where: { Name: chname },
	data: data
})
}
}
catch (error){
	console.log(error);
	return "Error while leaving channel";
}

}

async createCh(userID, chname, passwd, isDirect, isInviteOnly)
{
	try {
		const channel = await this.prisma.channel.findFirst({ where: { Name: chname }, include: { Users: true }});
		if (channel){
			if (await this.checkPasswd(passwd, channel) === false) { return "Incorrect Password"};
			if (channel.IsInviteOnly && !channel.InvitedIDs.some((element) => element === userID)) {return "You are not invited to this channel."}
			if (channel.BannedIDs.some((element) => element === userID)) { return "You are banned from this channel" };
			if (channel.IsDirect && channel.Users.length === 2) { return "This is a priv channel you can not access."};
			if (channel.Users.some(element => element.id === userID)) { return "You are already in channel."};
			return this.joinCh(userID, chname);
		}
		else{
			if (passwd !== "undefined")
			{
				passwd = await bcrypt.hash(passwd, 10);
			}
			const channel = await this.prisma.channel.create({
				data: {
					Name: chname,
					Password: passwd,
					ChannelOwnerID: userID,
					AdminIDs: [userID],
					IsDirect: isDirect,
					IsInviteOnly: isInviteOnly,
					Users : { connect: { id : userID } }
				},
			})
			console.log(channel.Name);
			return channel;

		}
	}catch(error){
		return "Error while performing channel operation"}
	}

	private async setAdmin(channel, targetUser){
		if ((channel.AdminIDs.some((element) => element === targetUser.id)))
		return "Dest User is Already Admin!";
	channel.AdminIDs.push(targetUser.id);
		console.log(channel.BannedIDs);
		try{
			await this.prisma.channel.update({
				where: { Name: channel.Name},
				data: { AdminIDs: channel.AdminIDs}
			})
		}
		catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
		return undefined;
	}

	private async ban(channel, targetUser){
		if ((channel.BannedIDs.some((element) => element === targetUser.id)))
		return "Dest User is Already Banned !";
	channel.BannedIDs.push(targetUser.id);
	console.log(channel.BannedIDs);
	try{
		await this.prisma.channel.update({
			where: { Name: channel.Name },
			data: {
				AdminIDs: {
					set: channel.AdminIDs.filter(id => id !== targetUser.id)
				},
				BannedIDs: channel.BannedIDs,
				Users: {
					disconnect: {
						id: targetUser.id
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

private async kick(channel, targetUser){
	try{
		await this.prisma.channel.update({
			where: { Name: channel.Name },
			data: {
				AdminIDs: {
					set: channel.AdminIDs.filter(id => id !== targetUser.id)
				},
				Users: {
					disconnect: {
						id: targetUser.id
					}
				}
			}
		})
	}catch(error){
		console.log("Error ! While channel updating");
		return "Error ! While channel updating";
	}
	}

	private async mute(channel, targetUser)
	{
		let status: string;
		try{
			if ((channel.MutedIDs.some((element) => element == targetUser.id)))
			{
				channel.MutedIDs = channel.MutedIDs.filter(element => element !== targetUser.id);
				status = "The User Unmuted.";
			}
			else { channel.MutedIDs.push(targetUser.id)};
			await this.prisma.channel.update({
				where: {Name: channel.Name},
				data: { MutedIDs: channel.MutedIDs }
			})
			return status;
		}catch(error){
			console.log("Error ! While channel updating");
			return "Error ! While channel updating";
		}
	}

	private async invite(channel, targetUser)
	{
		if (!channel.IsInviteOnly)
		return "The Channel is not Invite Only";
	try{
		if ((channel.InvitedIDs.some((element) => element == targetUser.id)) || (channel.Users.some((element => element.nick == targetUser.nick))))
		return "The User Already Invited or on Channel";
	else { channel.InvitedIDs.push(targetUser.id) }
	await this.prisma.channel.update({
		where: { Name: channel.Name },
		data: { InvitedIDs: channel.InvitedIDs }
	})
}catch(error){
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
		return "Err: You are not Channel Admin!";
	}
	const targetUser = await channel.Users.find((element) => element.nick == destUser)
	if (targetUser !== undefined)
	{
		//If i am not channel owner i cant ban this user because he is admin or channelowner but if i am channel owner i can ban.
		if (((channel.AdminIDs.some((element) => element === targetUser.id)) || (channel.ChannelOwnerID === targetUser.id))
			&& !(channel.ChannelOwnerID === userID))
			return "Dest User is Admin or Channel Owner !";
		else if (process === "ban")
		{
			const retBan = await this.ban(channel, targetUser);
			console.log(retBan);
			return (retBan !== undefined) ? retBan : ("The user has been successfully banned.");
		}
		else if (process === "setadmin")
		{
			const retSetAdmin = await this.setAdmin(channel, targetUser);
			console.log(retSetAdmin);
			return (retSetAdmin !== undefined) ? retSetAdmin : ("The user has been successfully assigned as admin.");
		}
		else if (process === "kick")
		{
			const retKick = await this.kick(channel, targetUser);
			console.log(retKick);
			return (retKick !== undefined) ? retKick : ("The user has been successfully kicked.");
		}
		else if (process === "mute")
		{
			const retMute = await this.mute(channel, targetUser);
			return (retMute !== undefined) ? retMute : ("The user has been successfully muted."); //mute&unmute
		}
	}
	else if (process === "inviteCh")
	{
		const foundUser = await this.prisma.user.findFirst({
			where: {nick: destUser},
		})
		const ret = await this.invite(channel, foundUser);
		return (ret !== undefined) ? ret : ("The user has been successfully invited.");
	}
	else
		return "The User not in the channel";
}

//	Password Op.

	private async setPassword(oldpassword: string, password: string)
    {
        if (oldpassword === "undefined")
        {
            password = await bcrypt.hash(password, 10);
            let data:any = { Password: password };
            return data;
        }
        throw "The channel already has password.";
    }

    private async changePassword(oldpassword:string, password: string)
    {
        if (!(await bcrypt.compare(password, oldpassword)))
        {
			password = await bcrypt.hash(password, 10);
            let data:any = { Password: password };
            return data;
        }
        throw "The Passwords are same.";
    }

    private async removePassword()
    {
        let data:any = { Password: "undefined" };
        return data;
    }


    async channelPasswordOp(userID: number, chname: string, process: string, password?: string)
    {
        let data: any;
        const channel = await this.prisma.channel.findFirst({
            where: { Name: chname }, include: { Users: true,}
        });
        if (channel.ChannelOwnerID === userID)
        {
            try {
                switch(process)
                {
                    case "set":
                        data = await this.setPassword(channel.Password, password);
						break;
					case "change":
                        data = await this.changePassword(channel.Password, password);
						break;
					case "remove":
                        data = await this.removePassword();
						break;
                }
				await this.prisma.channel.update({
					where:{ Name: channel.Name },
					data: data,
				})
				return "The Channel Password " + process  + " Successfull.";
            }catch (error) { return error };
        }
        else
            return "You are not channel owner.";
    }
//

	async getUsersInCh(chname:string, userID: number)
	{
		let channel = await this.prisma.channel.findFirst({
			where: { Name: chname },
			select: {
				Users: {
					select: { id: true , nick: true},
				}
			}
		})
		let users = channel.Users;
		users = users.filter( (element) => element.id !== userID)
		return users;
	}
}
