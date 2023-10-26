import { Controller, Get, Res, Req, UseGuards} from '@nestjs/common';
import { Response} from 'express';
import * as path from 'path'
import { JwtGuard } from './auth/strategies/jwt/jwt.guard';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
	constructor(private prisma: PrismaService, private userService: UserService){}

	@Get('leaderboard')
	@UseGuards(JwtGuard)
	async getLeaderboard(@Res() response : Response){
		console.log("leaderboard");
		const users = await this.prisma.user.findMany({
			orderBy: {
				LatterLevel: 'desc',
			}
		})
		return response.send(users);
	}
	// @Get('profile')
	// @UseGuards(JwtGuard)
	// async getProfile(@Res() response : Response, @Req() req : Request){
	// 	console.log("profile");
	// 	// const userID: number = parseInt(req.body.toString(), 10);
	// 	// const userProfile = this.userService.getUserByID(userID);
	// 	const user = await this.prisma.user.


	// 	return response.send(userProfile);
	// }

}
