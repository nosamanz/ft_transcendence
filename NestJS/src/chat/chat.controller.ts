import { Controller, Get, UseGuards, Res, Param, Req, ParseBoolPipe} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { connectedClients } from './chat.gateway';
import { ChatChannelService } from './chat-channel.service';
import { Ignore } from '@prisma/client';

@Controller('chat/:channelName')
export class ChatChannelController {
    constructor(
            private chatChannelService: ChatChannelService,
            private prisma: PrismaService,
            private userService: UserService,
    ){}

    @Get('/leave')
    @UseGuards(JwtGuard)
    async getLeave(
        @Res() res: Response,
        @Req() req: Request,
        @Param('channelName') chname: string
    )
    {
        const userID: number = parseInt(req.body.toString(), 10);
        return res.send(await this.chatChannelService.leaveChannel(chname, userID));
    }

    @Get('/users')
    @UseGuards(JwtGuard)
    async getUsersInChannel(
        @Res() res: Response,
        @Req() req: Request,
        @Param('channelName') chname: string)
    {
        const userID: number = parseInt(req.body.toString(), 10);
        return res.send(await this.chatChannelService.getUsersInCh(chname, userID));
    }

    @Get('/messages')
    @UseGuards(JwtGuard)
    async getMessages(
        @Res() response: Response,
        @Req() req: Request,
        @Param('channelName') chname: string)
    {
        const userID: number = parseInt(req.body.toString(), 10);
        const include = { IgnoredUsers: true};
        const user = await this.userService.getUserByID(userID, include);
        //Lets find Channel
        const channel = await this.prisma.channel.findFirst({
            where: {
                Name: chname,
            },
            select: {
                messages: true,//order
                Users: {
                    where: {
                        id: userID
                    },
                    select: {
                        id: true,
                        IgnoredUsers: true,
                    }
                },
                BannedIDs: true,
                MutedIDs: true,
            }
        });
        let messages = channel.messages;

        channel.messages.forEach((message) => console.log("Mes: "+ message.senderID + "  " + message.message))
        channel.BannedIDs.forEach((id) => console.log("Banned: "+ id))
        channel.MutedIDs.forEach((id) => console.log("Muted: "+ id))
        user.IgnoredUsers.forEach((element) => console.log("ignored: "+ element.OtherUserID))

        messages = messages.filter(
            message => (
                message.senderID !== channel.MutedIDs.find((element) => element === message.senderID) &&
                message.senderID !== channel.BannedIDs.find((element) => element === message.senderID)
                    )
                )
        const ignored = user.IgnoredUsers.find((element) => element.OtherUserID)
        if (ignored)
            messages = messages.filter(element => element.senderID !== ignored.OtherUserID)
        messages.forEach((message) => console.log("Mes Send: "+ message.senderID + "  " + message.message))
        return response.send(messages);
    }

    @Get('/setAdmin/:user')
    @UseGuards(JwtGuard)
    async getNewAdmin(
        @Req() req: Request,
        @Res() res: Response,
        @Param('user') destUser: string,
        @Param('channelName') chname:string)
    {
        const userID: number = parseInt(req.body.toString(), 10);
        try{
            return res.send({msg: await this.chatChannelService.channelOp(userID, chname, destUser, "setadmin")});
        }catch(error){
            return res.status(580).json({error: error}) }
    }

    @Get('/kick/:user')
    @UseGuards(JwtGuard)
    async getKickedUser(
        @Req() req: Request,
        @Res() res: Response,
        @Param('user') destUser: string,
        @Param('channelName') chname: string)
    {
        const userID: number = parseInt(req.body.toString(), 10);
        try{
            return res.send({msg: await this.chatChannelService.channelOp(userID, chname, destUser, "kick")});
        }catch(error){
            return res.status(580).json({error: error});
        }

    }

    @Get('/mute/:user')
    @UseGuards(JwtGuard)
    async getMutedUser(
        @Req() req: Request,
        @Res() res: Response,
        @Param('user') destUser: string,
        @Param('channelName') chname : string)
    {
        const userID: number = parseInt(req.body.toString(), 10);
        try{
            return res.send({msg: await this.chatChannelService.channelOp(userID, chname, destUser, "mute")});
        }catch(error){
            return res.status(580).json({error: error});
        }
    }

    @Get('/ban/:user')
    @UseGuards(JwtGuard)
    async getBannedUser(
        @Req() req: Request,
        @Res() res: Response,
        @Param('user') destUser: string,
        @Param('channelName') chname:string)
    {
        const userID: number = parseInt(req.body.toString(), 10);
        try{
            return res.send({msg: await this.chatChannelService.channelOp(userID, chname, destUser, "ban")});
        }catch(error){
            return res.status(580).json({error: error});
        }
    }

    @Get('/inviteChannel/:user')
    @UseGuards(JwtGuard)
    async InviteUserToChannel(
        @Req() req: Request,
        @Res() res: Response,
        @Param('channelName') chname: string,
        @Param(':user') destUser: string
    ){
        const userID: number = parseInt(req.body.toString(), 10);
        console.log(await this.chatChannelService.channelOp(userID, chname, destUser, "inviteCh"))
        // return res.send(await this.chatChannelService.channelOp(userID, chname, destUser, "inviteCh"));
    }

    // ? invite only
    // IMPORTANT: When we request to this part of the chat fill the :isDirect and :isInviteOnly (do not make request with undefined except for passwd part)
    @Get('/create/:isDirect/:isInviteOnly/:passwd')
    @UseGuards(JwtGuard)
    async getChannel(
        @Req() req: Request,
        @Res() res: Response,
        @Param('channelName') chname: string,
        @Param('isDirect', new ParseBoolPipe()) isDirect : boolean,
        @Param('isInviteOnly', new ParseBoolPipe()) isInviteOnly : boolean,
        @Param('passwd') passwd: string
    ){
        const userID: number = parseInt(req.body.toString(), 10);
        const ch =  await this.chatChannelService.createCh(userID, chname, passwd, isDirect, isInviteOnly);
        return res.send(ch);
        // return res.send({res: await this.chatChannelService.createCh(userID, chname, passwd, isDirect, isInviteOnly)});
    }

    //CHANNEL PASSWORD OP.

    @Get('/setChannelPassword/:password')
    @UseGuards(JwtGuard)
    async setChannelPassword(
        @Req() req: Request,
        @Res() res: Response,
        @Param('channelName') chname: string,
        @Param('password') password: string
    ){
        const userID: number = parseInt(req.body.toString(), 10);
        return res.send({res: await this.chatChannelService.channelPasswordOp(userID, chname, "set", password)});
    }

    @Get('/changeChannelPassword/:password')
    @UseGuards(JwtGuard)
    async changeChannelPassword(
        @Req() req: Request,
        @Res() res: Response,
        @Param('channelName') chname: string,
        @Param('password') password: string
    ){
        const userID: number = parseInt(req.body.toString(), 10);
        return res.send({res: await this.chatChannelService.channelPasswordOp(userID, chname, "change", password)});
    }

    @Get('/removeChannelPassword')
    @UseGuards(JwtGuard)
    async removeChannelPassword(
        @Req() req: Request,
        @Res() res: Response,
        @Param('channelName') chname: string,
    ){
        const userID: number = parseInt(req.body.toString(), 10);
        return res.send({res: await this.chatChannelService.channelPasswordOp(userID, chname, "remove")});
    }
}

@Controller('chat')
export class ChatController {
    @Get('connect')
    @UseGuards(JwtGuard)
    bindSocket(@Req() req: Request): void
    {
        const userID: number = parseInt(req.body.toString(), 10);
        const socketID: string = req.headers['socket-id'];
        if(!socketID || !userID)
        {
            console.log("SocketID or UserID couldn't find!");
            return;
        }
        const indexToUpdate = connectedClients.findIndex((clientInfo) => clientInfo.client.id === socketID);

        if (indexToUpdate === -1) {
            console.log("Client id couldn't be bind with userID!");
            return;
        }
        console.log("UserID: " + userID +" binded with socket " + socketID);
        connectedClients[indexToUpdate].id = userID;
    }
}
