import { Controller, Get, Post , Body, Res, UseGuards, Req, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';

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
		return await this.userService.getUserByID(userID, true);
	}

	@Get('changeNick/:nickToChange')
	@UseGuards(JwtGuard)
	async ChangeNick(
		@Req() req: Request,
		@Param('nickToChange') nickToChange: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		await this.userService.updateUser({nick: nickToChange}, user);
	}

	@Get('addFriend/:friendName')
	@UseGuards(JwtGuard)
	async AddFriend(
		@Req() req: Request,
		@Param('friendName') friendName: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		// let friends: FriendDto[] = user.friends;
		await this.userService.updateUser({nick: friendName}, user);
	}

	@Get('ignoreUser/:user')
	@UseGuards(JwtGuard)
	async IgnoreUser(
		@Req() req: Request,
		@Res() res: Response,
		@Param('user') destuser: string)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		const destUser = await this.userService.getUserByID(userID, true);
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
		const user = await this.userService.getUserByID(userID, true);
		const channels = await this.userService.getChannels(user, false);
		return res.send(channels);
	}

	@Get('privChannels')
	@UseGuards(JwtGuard)
	async GetPrivChannels(
		@Req() req: Request,
		@Res() res: Response)
	{
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		const channels = await this.userService.getChannels(user, true);
		return res.send(channels);
	}


	@Post('getForm')
	@UseGuards(JwtGuard)
	async getForm(@Req() req: Request, @Body() info: any){
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);

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
