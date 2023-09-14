import { Controller, Get, Post , Body, Res, UseGuards, Headers, Req} from '@nestjs/common';
import { ReplaySubject } from 'rxjs';
import { CreateUserDto } from 'src/DTO/user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/jwtconstants';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';

@Controller('user')
export class UserController {
	constructor( private userService: UserService, private jwtService: JwtService){}

	@Get()
	@UseGuards(JwtGuard)
	async GetUser(@Headers() headers: Record<string, string>, @Req() request: Request): Promise<CreateUserDto>{
		// console.log(request.body);
		// const token = headers['authorization'].replace('Bearer ', '');
		// console.log("--------------");
		// console.log(token);
		// try
		// {
			// const decode = this.jwtService.verify(token, jwtConstants);
			console.log("Body: " + request.body);
			const userID: number = parseInt(request.body.toString(), 10);
			const user = await this.userService.getUserByID(userID);
			// console.log("Decode: " + decode.sub + "--" + decode.iat);
			console.log("User: " + user)
			return user
		// }
		// catch(error)
		// {
		// 	console.log(error.toString());
		// 	return(undefined)
		// }
	}
}
