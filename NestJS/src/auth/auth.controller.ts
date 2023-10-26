import { Controller, Get, Post , Body, Res, UseGuards, Headers} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('auth/42')
export class AuthController {
	constructor(private authService: AuthService, private userService: UserService){}

	// {Jwt_Token, 0} The new user has been saved in database and the token has been created.
	// {Jwt_Token, 1} The user has already been saved in database and the token has been created.
	// {user_id, 2} The user should be redirected to the TFA page.
	// // 3 The user has already have a jwt.
	@Post('signin_intra')
	async signin_intra(@Headers('authorization') head: string, @Body() data: any) {
		// const user = await this.userService.getUserByJWT(head);
		// if(user !== undefined)
		// 	return(3);
		if(!data)
			return("404 Not Found");
		return (this.authService.signin_intra(data));
	}
}
