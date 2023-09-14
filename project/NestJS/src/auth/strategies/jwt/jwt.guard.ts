import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';
import { jwtConstants } from 'src/jwtconstants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtGuard implements CanActivate {
	constructor( private userService: UserService, private jwtService: JwtService){}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization'].replace('Bearer ', '');
		console.log("--------------");
		console.log(token);
		try
		{
			const decode = this.jwtService.verify(token, jwtConstants);
      request.body = decode.sub;
			return true
		}
		catch(error)
		{
			console.log(error.toString());
			return false
		}
  }
}
