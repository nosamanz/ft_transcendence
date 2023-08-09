import { Controller, Get, Param, Post , Body, Res} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User} from './entitiest/user.entity';
import { Response } from 'express';
import * as path from 'path'

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService){}

	@Get()
	getUsers(@Res() response : Response){
		this.usersService.findAll();
		const filePath = path.join(__dirname, '..', '..' ,'..', 'index', 'index.html');
		return response.sendFile(filePath);
	}
	@Get(':id')
	getUserById(@Param('id') id: string): User { // TODO : auto parse ID
		return this.usersService.findById(Number(id));
	}

	@Post()
	createUserr(@Body() body: CreateUserDto): User {
		return this.usersService.createUser(body)
	}

}
