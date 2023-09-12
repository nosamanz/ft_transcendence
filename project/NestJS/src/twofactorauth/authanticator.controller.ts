import { Controller, Get, Param, Post, Request, Res, UnauthorizedException } from '@nestjs/common';
import { AuthanticatorService } from './authanticator.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as qrcode from 'qrcode';
import { CreateUserDto } from 'src/DTO/user.dto';
import { UserService } from 'src/user/user.service';
import { GuardsConsumer } from '@nestjs/core/guards';

@Controller('auth/tfa')
@ApiBearerAuth()
export class AuthanticatorController {
	constructor(private authanticatorService: AuthanticatorService, private userService: UserService) { }

	@Get('QR')
	async getQR(@Request() req, @Res() res) {
		const user = await this.userService.getUserByLogin("oozcan"/* req.user.login */);
		const qrCode = await this.authanticatorService.getQR(user);
		const qrCodeBuffer = await qrcode.toBuffer(qrCode);
		res.set('Content-type', 'image/png');
		res.send(qrCodeBuffer);
	}

	@Get('enable')
	async enableTwoFactor(@Request() req, @Res() res){
		const user = await this.userService.getUserByLogin("oozcan"/* req.user.login */);
		const tfa = await this.authanticatorService.generateTwoFactorAuthenticationSecret(user);
		const qrCodeBuffer = await qrcode.toBuffer(tfa.qrCode);
		res.set('Content-type', 'image/png');
		res.send(qrCodeBuffer);
	}

	@Get('disable')
	async disableTwoFactor(@Request() req, @Res() res) {
		const user = await this.userService.getUserByLogin("oozcan"/* req.user.login */);
		await this.authanticatorService.disableTwoFactorAuthentication(user);
	}

	@Get('verify/:token/:username')
	async verifyToken(@Param('token') token: string, @Param('username') username: string) {
		const user = await this.userService.getUserByLogin(username);
		if (!user.TFAuth)
			throw new UnauthorizedException();
		const result = this.authanticatorService.verifyTwoFactorAuthentication(token, user.TFSecret);
		console.log("You could not: " + result);
		if (result)
			return await this.authanticatorService.Login(user);
		throw new UnauthorizedException();
	}
}

