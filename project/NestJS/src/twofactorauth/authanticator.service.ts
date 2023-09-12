import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { CreateUserDto } from '../DTO/user.dto'
import { PrismaService } from 'src/prisma/prisma.service';""
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthanticatorService {
	constructor(private prisma: PrismaService, private userService: UserService, private jwtService: JwtService) { }

	getQR(user: CreateUserDto)
	{
		const qrCode = speakeasy.otpauthURL({
			secret: user.secretAscii,
			label: user.login,
			issuer: 'Transcendence',
		});
		return (qrCode);
	}

	async generateTwoFactorAuthenticationSecret(user: CreateUserDto) {
		const secret = speakeasy.generateSecret({ length: 20 });
		await this.prisma.user.update({
			where: {
				login: user.login,
			},
			data: {
				TFAuth: true,
				TFSecret: secret.base32,
				secretAscii: secret.ascii
			},
		})
		const qrCode = speakeasy.otpauthURL({
			secret: secret.ascii,
			label: user.login,
			issuer: 'Transcendence',
		});
		return { qrCode, secret: secret.base32 }
	}

	async disableTwoFactorAuthentication(user: CreateUserDto) {
		await this.prisma.user.update({
			where: {
			  login: user.login,
			},
			data: {
				TFAuth: false,
				TFSecret: "",
				secretAscii: ""
			},
		  })
	}

	verifyTwoFactorAuthentication(twoFactorCode: string, userSecret: string): boolean {
		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token: twoFactorCode,
		});
		return verified;
	}

	async Login(user: CreateUserDto) {
		console.log("You successfully logged in!!");
		return;
		// await this.userService.updateUser({ state: 'online' }, user);
		// return { access_token: await this.jwtService.sign({ Login: user.login, Id: user.id, Status: user.state }) };
	}
}
