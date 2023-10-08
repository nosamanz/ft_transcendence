import { Controller, Get, Post , Body, Res, UseGuards, Headers, Req, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';

@Controller('user')
export class UserController {
	constructor( private userService: UserService){}

	@Get()
	@UseGuards(JwtGuard)
	async GetUser(@Req() req: Request): Promise<any>{
		const userID: number = parseInt(req.body.toString(), 10);
		return await this.userService.getUserByID(userID, true);
	}

	@Get('changeNick/:nickToChange')
	@UseGuards(JwtGuard)
	async ChangeNick(@Req() req: Request, @Param('nickToChange') nickToChange: string){
	const userID: number = parseInt(req.body.toString(), 10);
	const user = await this.userService.getUserByID(userID, true);
	await this.userService.updateUser({nick: nickToChange}, user);
	}

	@Get('addFriend/:friendName')
	@UseGuards(JwtGuard)
	async AddFriend(@Req() req: Request, @Param('friendName') friendName: string){
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		// let friends: FriendDto[] = user.friends;
		await this.userService.updateUser({nick: friendName}, user);
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
