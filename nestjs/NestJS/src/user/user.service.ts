import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/jwtconstants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService
{
    constructor(private prisma: PrismaService,private jwtService: JwtService){}

    // undefined if couldn't verify the token or the header does not exist
    // {user}
    async getUserByJWT(header: string): Promise<any> {
        if(!header)
            return(undefined);
		const token = header.replace('Bearer ', '');
		try
		{
			const decode = this.jwtService.verify(token, jwtConstants);
			const userID: number = decode.sub;
			const user = await this.getUserByID(userID, true);
			return user;
		}
		catch(error)
		{
			return(undefined)
		}
    }
    async getUserByID(id: number, is_friends: boolean): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                id: id
            },
            // include: {
            //     friends: is_friends,
            // },
        });
        return user;
    }
    async getUserByLogin(login: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                login: login
            },
        });
        return user;
    }
    async updateUser(userUpdateInformation: any, user: any) {
        try
        {
            await this.prisma.user.update({
                where: {
                    login: user.login
                },
                data: userUpdateInformation,
            });
        }
        catch(error)
        {
            console.log("Couldn't be updated!!(" + userUpdateInformation.nick + ")");
        }
    }

    async createToken(userId: number): Promise<string> {
		const payload = {
			"sub": userId,
			"iat": 13334150876,
		};
		return this.jwtService.sign(payload, jwtConstants);
	}
}
