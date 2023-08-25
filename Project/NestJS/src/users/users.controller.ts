import { Controller, Get, Param, Post , Body, Res} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import * as path from 'path'

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService){}

	@Get()
	getUsers(@Res() response : Response){
		const filePath = path.join(__dirname, '..', '..' ,'..', 'Front', 'html', 'index.html');
		return response.sendFile(filePath);
	}

	@Post()
	async createUser(@Body('nick') nick: string, @Body('pass') pass: string) {
		console.log(nick + "--" + pass);
		return this.usersService.createUser(nick, pass);
  	}
}
