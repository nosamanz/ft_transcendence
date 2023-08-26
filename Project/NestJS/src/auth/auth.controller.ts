import { Controller, Get, Param, Post , Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as path from 'path'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService){}

	@Get('getcode')
	getUsers(@Res() response : Response){
		const filePath = path.join(__dirname, '..', '..' ,'..', 'Front', 'html', 'auth.html');
		return response.sendFile(filePath);
	}

	@Post('signin_intra')
	async signin_intra(@Body() info: any) {
		if(!info)
			return("404 Not Found");
		console.log('Post received:', info);
		return (this.authService.signin_intra(info.data));
	}
}
