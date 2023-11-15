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

	@Get('/result/:id/:myScore/rivalScore')
	@UseGuards(JwtGuard)
	async GetSaveResult(
		@Req() req: Request,
		@Res() res: Response,
		@Param('id', new ParseIntPipe()) rivalID: number,
		@Param('myScore', new ParseIntPipe()) myScore: number,
		@Param('rivalScore', new ParseIntPipe()) rivalScore: number,): Promise<any>{
		const userID: number = parseInt(req.body.toString(), 10);
		let user = await this.userService.getUserByID(userID);
		const rival = await this.userService.getUserByID(rivalID);

		//Save History to DB
		try{
			await this.prisma.history.create({
				data: {
					RivalNick: rival.nick,
					Score: myScore,
					RivalScore: rivalScore,
					User: {
						connect: { id: userID },
			}}})
			await this.prisma.history.create({
				data: {
					RivalNick: user.nick,
					Score: rivalScore,
					RivalScore: myScore,
					User: {
						connect: { id: rivalID },
		}}})}
		catch(error){
			console.log("Error when creating History (on DB)");
		}

		//Change User and Rival win lose count

		let userUpdateInformation:any;

		userUpdateInformation = {
			WinCount: user.WinCount + 1,
			LatterLevel: user.LatterLevel + 100,
		}
		await this.userService.updateUser(userUpdateInformation, userID);

		userUpdateInformation = {
			LoseCount: rival.LoseCount,
			LatterLevel: rival.LatterLevel - 50,
		}
		await this.userService.updateUser(userUpdateInformation, rivalID);

		// userID: my id
		// rivalID: rivals id
		// myScore: my score. I am always the winner. Sadece yenen kişiden istek gelcek
		// rivalScore: rivals score
	}
}
