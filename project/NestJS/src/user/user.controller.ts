import { Controller, Get, Post , Body, Res, UseGuards, Headers} from '@nestjs/common';
import { CreateUserDto } from 'src/DTO/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor( private userService: UserService){}

	@Get()
	// @UseGuards()
	async GetUser(@Headers() headers: Record<string, string>): Promise<CreateUserDto>{
		console.log(headers['authorization']);
		const user = await this.userService.getUserByLogin('mkardes');
		return user;
	}
}
