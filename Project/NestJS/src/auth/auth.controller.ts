import { Controller, Get, Post , Body, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as path from 'path';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService){}

	@Get('getcode')
	getUsers(@Res() response : Response){
		const filePath = path.join(__dirname, '..', '..' ,'..', 'Front', 'html', 'auth.html');
		return response.sendFile(filePath);
	}

	// @Get(':code')
	// async getLogin(@Param('code') code: string, @Res() res: Response){
	// 	console.log("yardım et");
	// 	const login = await this.authService.getLogin(code);

	// 	res.set('Content-Type', 'text/plain'); // Set the appropriate content type
	// 	res.send(login);
	// }

	@Post('signin_intra')
	async signin_intra(@Body() info: any) {
		if(!info)
			return("404 Not Found");
		console.log('Post received:', info);
		return (this.authService.signin_intra(info.data));
	}
}
