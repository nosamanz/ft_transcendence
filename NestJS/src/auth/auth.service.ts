import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor( private prisma: PrismaService, private userService: UserService) {}

	async signin_intra(data: any): Promise<{token: string, result: number} | number | {user_id: number, result: number}> {
		console.log("Mer");
		const UserInfo = await this.getUserFromApi(data);

		console.log("Welcome " + UserInfo.login);
		let user: any;
		try
		{
			user = await this.userService.getUserByLogin(UserInfo.login);
		}
		catch(error)
		{
			console.log("Database does not contain that user.");
		}
		let token: string;
		if(user)
		{
			if(user.TFAuth === true)
			{
				console.log("You are redirecting to the TFA page ");
				return ({user_id: UserInfo.id, result: 2});
			}
			console.log("Successfully Logged In");
			token = await this.userService.createToken(UserInfo.id);
			return ({token: token, result: 1});
		}
		token = await this.userService.createToken(UserInfo.id);
		await this.prisma.user.create({
			data: {
				id:				UserInfo.id,
				login:			UserInfo.login,
				nick:			UserInfo.login,
				IsFormSigned:	false,
				TFAuth:			false,
				TFSecret:		"Secret",
				secretAscii:	"SecretAscii",
				ImageExt:		"",
				WinCount:    	0,
				LoseCount:   	0,
				LatterLevel: 	0,
				Achievements:	{
					create: {
						Ac1:	false,
						Ac2:	false,
						Ac3:	false,
						Ac4:	false,
					}
				},
				Friends:     	{},
				IgnoredUsers:	{},
				MatchHistory:	{},
				Channels:     	{},
			}
		});
		// defaultuKaydet
		console.log("Successfully Logged In and Saved in DataBase");
		return ({token: token, result: 0});

	}

	async getUserFromApi(data: any): Promise<any>{
		const form = new FormData();
		form.append('grant_type', 		data['grant_type']);
		form.append('client_id', 		data['client_id']);
		form.append('client_secret', 	data['client_secret']);
		form.append('code', 			data['code']);
		form.append('redirect_uri', 	data['redirect_uri']);
		
		const responseToken = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			body: form
		});
		const dataToken = await responseToken.json();
		const responseInfo = await fetch('https://api.intra.42.fr/v2/me', {
			headers: {
				'Authorization': 'Bearer ' + dataToken.access_token
			}
		});
		if (responseInfo.ok === false)
		{
			console.log("The info couldn't be taken from 42 api!!");
			return undefined;
		}
		return await responseInfo.json();
	}
}
