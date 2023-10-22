import { Body, Headers, Res, Post, Controller} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/jwtconstants';
import { merge } from 'rxjs';

@Controller('avatar')
export class AvatarController {
    constructor(private avatarService: AvatarService, private userService: UserService, private jwtService: JwtService) {}

    @Post('upload')
    async uploadAvatar(
        @Res() res: any,
        @Body() body: any,
        @Headers('authorization') JWT: string,
    ) {
        //JWT CONTROL
        try{
            const token = JWT.replace('Bearer ', '');
            const decode = this.jwtService.verify(token, jwtConstants);
            const userID: number = parseInt(decode.sub, 10);
            const file = body.file;
            const ret: { nick: string, image: string } = { nick: "", image: "" };
            ret.nick = await this.userService.changeNick(userID, body.nick);
            ret.image = await this.avatarService.changeAvatar(file, userID);
            return res.send(ret);
        }
        catch(error)
        {
            console.log("Incorrect token!!");
		    return ;
        }
    }
}

//curl http://10.12.14.1:80/avatar/upload -F 'file=@./default.jpeg' -F 'name=test' -F 'gel=ali' -H "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTUxLCJpYXQiOjEzMzM0MTUwODc2fQ.O5pJAZCwSgDnErj5MRZpMMEIOgwgDHNXFaYCwwJqExw"
//curl -X POST http://10.12.14.1:80/avatar/upload -F 'file=@./default.jpeg'  -H "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTUxLCJpYXQiOjEzMzM0MTUwODc2fQ.O5pJAZCwSgDnErj5MRZpMMEIOgwgDHNXFaYCwwJqExw"
