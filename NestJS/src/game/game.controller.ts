import { Controller, Get, Param, ParseIntPipe, Req, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Controller('game')
export class GameController {
	constructor(
		private userService: UserService,
		private prisma: PrismaService)
		{}
   	@Get('/res')
	async abc()
	{
		console.log("GET GAME");
	}
	@Get('/result/:id/:myScore/:rivalScore')
	@UseGuards(JwtGuard)
	async GetSaveResult(
		@Req() req: Request,
		// @Res() res: Response,
		@Param('id', new ParseIntPipe()) rivalID: number,
		@Param('myScore', new ParseIntPipe()) myScore: number,
		@Param('rivalScore', new ParseIntPipe()) rivalScore: number): Promise<any>{
		const userID: number = parseInt(req.body.toString(), 10);
		let user = await this.userService.getUserByID(userID, {Achievements: true});
		const rival = await this.userService.getUserByID(rivalID, {Achievements: true});

		console.log("GAME RESULT");
		console.log("Match: ", userID, " ", rivalID, " ", myScore, "-", rivalScore);
		//Save History to DB
		try{
			await this.prisma.history.create({
				data: {
					RivalNick: rival.nick,
					Score: myScore,
					RivalLatter: rival.LatterLevel,
					RivalScore: rivalScore,
					User: {
						connect: { id: userID },
			}}})
			await this.prisma.history.create({
				data: {
					RivalNick: user.nick,
					RivalLatter: user.LatterLevel,
					Score: rivalScore,
					RivalScore: myScore,
					User: {
						connect: { id: rivalID },
		}}})}
		catch(error){
			console.log("Error when creating History (on DB)");
		}

		const newUserWin:number = user.WinCount + 1;

		//Change User and Rival win lose count
		// let achievements:any = { Ac1:false, Ac2:false, Ac3:false, Ac4:false, Ac5:false, Ac6:false }
		// let achievements = user.Achievements;
		if (newUserWin === 1)
		{
			// "First Win"
			// console.log(user.Achievements.)
			user.Achievements.Ac1 = true;
		}
		else if (newUserWin === 10)
		{
			// Win 10 Times
			user.Achievements.Ac3 = true;
		}
		else if (newUserWin === 5 && user.LoseCount === 0)
		{
			// Win 5 games without losing
			user.Achievements.Ac4 = true;
		}
		else if (newUserWin === 10 && user.LoseCount === 0)
		{
			// Win 10 games without losing
			user.Achievements.Ac5 = true;
		}
		if (rivalScore === 0)
		{
			// Win without conceding any goals
			user.Achievements.Ac6 = true;
		}
		if (rival.LoseCount + 1 === 1)
		{
			// "First Lose"
			rival.Achievements.Ac2 = true;
		}


		// let userUpdateInformation:any;

		// userUpdateInformation = {
		// 	WinCount: newUserWin,
		// 	LatterLevel: user.LatterLevel + 100,
		// 	Achievements: user.Achievements
		// }

		await this.userService.updateUserByID({
			WinCount: newUserWin,
			LatterLevel: user.LatterLevel + 100,
			Achievements: {
				update: {
					Ac1: user.Achievements.Ac1,
					Ac2: user.Achievements.Ac2,
					Ac3: user.Achievements.Ac3,
					Ac4: user.Achievements.Ac4,
					Ac5: user.Achievements.Ac5,
					Ac6: user.Achievements.Ac6
				}
			}
		}, userID);

		// userUpdateInformation = {
		// 	LoseCount: rival.LoseCount,
		// 	LatterLevel: rival.LatterLevel - 50,
		// 	Achievements: rival.Achievements
		// }

		await this.userService.updateUserByID({
			LoseCount: rival.LoseCount + 1,
			LatterLevel: rival.LatterLevel - 50,
			Achievements: {
				update: {
					Ac1: rival.Achievements.Ac1,
					Ac2: rival.Achievements.Ac2,
					Ac3: rival.Achievements.Ac3,
					Ac4: rival.Achievements.Ac4,
					Ac5: rival.Achievements.Ac5,
					Ac6: rival.Achievements.Ac6
				}
			}
		}, rivalID);
		// userID: my id
		// rivalID: rivals id
		// myScore: my score. I am always the winner. Sadece yenen kişiden istek gelcek
		// rivalScore: rivals score
		return;
	}
}
