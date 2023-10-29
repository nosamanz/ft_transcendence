import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/jwtconstants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService
{
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService){}

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
			const user = await this.getUserByID(userID);
			return user;
		}
		catch(error)
		{
			return(undefined)
		}
    }

    async getUserByID(id: number, include?: any): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                id: id
            },
            include: include
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

    async getUserByNick(nick: string, include?: any): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                nick: nick,
            },
            include: include
        });
        return user;
    }

    async updateUser(userUpdateInformation: any, user: any): Promise<number> {
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
            return -1;
        }
        return 0;
    }

    async createToken(userId: number): Promise<string> {
		const payload = {
			"sub": userId,
			"iat": 13334150876,
		};
		return this.jwtService.sign(payload, jwtConstants);
	}

    async getChannels(user: any, isDirect: boolean) : Promise<any> {
        const userCh = await this.prisma.user.findFirst({
            where: { id : user.id },
            select: {
                Channels: {
                    where: { IsDirect: isDirect },
                    include: { Users: true}
                }
            }
        })
        const channels = userCh.Channels;
        channels.forEach((element) => {
            element.Users = element.Users.filter((element) => element.id !== user.id)
        })
        if (isDirect === true)
        channels.forEach((element) => {
            // element = {...element, imgBuffer: openImg()}
        })

        return (channels);
    }

    async changeNick(userId: number, nickToChange: string): Promise<string>
    {
		const user = await this.getUserByID(userId);
        if (nickToChange === "" || nickToChange === user.nick)
            return "Nick could not be changed!";
        if (await this.updateUser({nick: nickToChange}, user) === -1)
            return "Nick in use!!";
        return "Nick is changed successfully.";
    }

    async signForm(user: any): Promise<boolean>
    {
        const userCh = await this.prisma.user.findFirst({
            where: { id : user.id },
        })
        if (userCh.IsFormSigned === false)
        {
            await this.updateUser({IsFormSigned: true}, userCh)
            return true;
        }
        else
            return false;
    }
}
