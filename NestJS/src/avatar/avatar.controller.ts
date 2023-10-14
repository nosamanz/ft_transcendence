import { Body, Headers, Get, ParseFilePipeBuilder, UseGuards, Post, UploadedFile, UseInterceptors, Controller, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AvatarService } from './avatar.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/jwtconstants';
import * as fs from 'fs';

@Controller('avatar')
export class AvatarController {
    constructor(private avatarService: AvatarService, private userService: UserService, private jwtService: JwtService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtGuard)
    async uploadAvatar(
        @Req() req: Request,
        @Body() body: any,
        @Headers('authorization') JWT: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log("Musab");
        const token = JWT.replace('Bearer ', '');
        const decode = this.jwtService.verify(token, jwtConstants);
        const userID: number = parseInt(decode.sub, 10);
		const user = await this.userService.getUserByID(userID);
        const AvatarFileName = userID + '.jpeg';

        const directoryPath = '../Avatars/';

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        await fs.writeFile(`${directoryPath}${AvatarFileName}`, file.buffer, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            }
        });

        return { res: "File uploadad successfully!" };
    }
}

//curl http://10.12.14.1:80/avatar/upload -F 'file=@./default.jpeg' -F 'name=test' -F 'gel=ali' -H "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTUxLCJpYXQiOjEzMzM0MTUwODc2fQ.O5pJAZCwSgDnErj5MRZpMMEIOgwgDHNXFaYCwwJqExw"
//curl -X POST http://10.12.14.1:80/avatar/upload -F 'file=@./default.jpeg'  -H "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTUxLCJpYXQiOjEzMzM0MTUwODc2fQ.O5pJAZCwSgDnErj5MRZpMMEIOgwgDHNXFaYCwwJqExw"
