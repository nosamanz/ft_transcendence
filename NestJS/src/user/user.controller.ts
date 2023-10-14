import { Controller, Get, Post , Body, Res, UseGuards, Req, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { userInfo } from 'os';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private prisma: PrismaService)
	{}

	@Get()
	@UseGuards(JwtGuard)
	async GetUser(@Req() req: Request): Promise<any>{
		const userID: number = parseInt(req.body.toString(), 10);
		return await this.userService.getUserByID(userID);
	}

	@Get('changeNick/:nickToChange')
	@UseGuards(JwtGuard)
	async ChangeNick(
		@Req() req: Request,
		@Param('nickToChange') nickToChange: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);
		await this.userService.updateUser({nick: nickToChange}, user);
	}


	@Get('ignoreUser/:user')
	@UseGuards(JwtGuard)
	async IgnoreUser(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') destuser: string)
		{
			const userID: number = parseInt(req.body.toString(), 10);
			const user = await this.userService.getUserByID(userID);
			const destUser = await this.userService.getUserByNick(destuser, true);
			if (user.IgnoredUsers.some((element) => element === destUser.id))
			// return res.send("")
			return "The User Already Ignored.";
			user.IgnoredUsers.push(destUser.id);
			await this.prisma.user.update({
			where: { id: user.id },
			data: { IgnoredUsers: user.IgnoredUsers }
		})
	}

	@Get('channels')
	@UseGuards(JwtGuard)
	async GetChannels(
		@Req() req: Request,
		@Res() res: Response)
		{
			const userID: number = parseInt(req.body.toString(), 10);
			const user = await this.userService.getUserByID(userID);
			const channels = await this.userService.getChannels(user, false);
			return res.send(channels);
		}

	@Get('privChannels')
	@UseGuards(JwtGuard)
	async GetPrivChannels(
		@Req() req: Request,
		@Res() res: Response){
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);
		const channels = await this.userService.getChannels(user, true);
		return res.send(channels);
	}

	@Get('acceptFriend/:friendName')
	@UseGuards(JwtGuard)
	async AddFriend(
		@Req() req: Request,
		@Param('friendName') friendName: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);

		const targetUser = await this.userService.getUserByNick(friendName);

		await this.prisma.friend.create({
			data: {
				OtherUserID: targetUser.id,
				OtherUserNick: targetUser.nick,
				UserId: user.id
			}
		})
		await this.prisma.friend.create({
			data: {
				OtherUserID: user.id,
				OtherUserNick: user.nick,
				UserId: targetUser.id
			}
		})
		await this.prisma.friendRequest.delete({
			where: {
				OtherUserID: targetUser.id
			}
		})
		// await this.userService.updateUser({nick: friendName}, user);
	}

	// has not done
	@Get('rejectFriend/:friendName')
	@UseGuards(JwtGuard)
	async RejectFriend(
		@Req() req: Request,
		@Res() res: Response,
		@Param('friendName') friendName: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);
		const updatedlist = user.FriendRequests.filter((element) => element !== friendName);
		await this.userService.updateUser({FriendRequests: updatedlist}, user);

	}

	@Get('friends')
	@UseGuards(JwtGuard)
	async GetFriends(
		@Req() req: Request,
		@Res() res: Response)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		// const user = await this.userService.getUserByID(userID);
		const friends = await this.prisma.user.findFirst({
			where: { id : userID},
			select : {
				Friends: {
					select: {
						OtherUserID: true,
						OtherUserNick: true,
					}
				},
			}
		})
		console.log(friends.Friends);
		return res.send(friends.Friends);
	}

	@Get('findUser/:user')
	@UseGuards(JwtGuard)
	async FindUser(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') finduser: string)
	{
		const targetUser = await this.userService.getUserByNick(finduser, {
			FriendRequests: true,
			Friends: true,
		});
		if (!targetUser)
			return res.send({res: -1, message: "User couldn't be found!!"});

		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);
		if (targetUser.FriendRequests.find((element) => element.OtherUserID === user.id))
			return res.send({res: -2, message: "The friend invitation has already been sended!"})
		if (targetUser.Friends.find((element) => element.OtherUserID === user.id))
			return res.send({res: -3, message: "The user is already your friend!"})

		await this.prisma.friendRequest.create({
			data: {
				OtherUserID: user.id,
				OtherUserNick: user.nick,
				UserId: targetUser.id,
			}
		})
		return res.send({res: 0, message: "The user has been invited as a friend."})
	}

	@Get('friendRequests')
	@UseGuards(JwtGuard)
	async GetFriendRequest(
		@Res() res: Response,
		@Req() req: Request)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);
		const friendrequests = await this.prisma.user.findFirst({
			where: { id : userID },
			select: { FriendRequests: true }
		})
		console.log(friendrequests);
		return res.send(friendrequests);
	}

	@Post('getForm')
	@UseGuards(JwtGuard)
	async getForm(@Req() req: Request, @Body() info: any){
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID);

		let UpdateInfo: {nick?: any,imgPath?: any} = {};
		// img yerele kaydet
		const imgPath = "path"

		if (info.nick !== undefined)
			UpdateInfo.nick = info.nick;
		if (info.img !== undefined)
			UpdateInfo.imgPath = imgPath;

		await this.userService.updateUser(UpdateInfo, user);
	}

}
