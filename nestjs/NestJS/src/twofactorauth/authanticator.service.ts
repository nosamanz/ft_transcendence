import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';""
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthanticatorService {
	constructor(private prisma: PrismaService, private userService: UserService, private jwtService: JwtService) { }

	getQR(user: any)
	{
		const qrCode = speakeasy.otpauthURL({
			secret: user.secretAscii,
			label: user.login,
			issuer: 'Transcendence',
		});
		return (qrCode);
	}

	async generateTwoFactorAuthenticationSecret(user: any) {
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

	async disableTwoFactorAuthentication(user: any) {
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

	async Login(user_id: number): Promise<string> {
		console.log("You successfully logged in!!");
		return await this.userService.createToken(user_id);
	}
}
