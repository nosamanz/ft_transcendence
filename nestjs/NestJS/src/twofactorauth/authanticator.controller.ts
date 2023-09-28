import { Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards, Headers } from '@nestjs/common';
import { AuthanticatorService } from './authanticator.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as qrcode from 'qrcode';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/strategies/jwt/jwt.guard';
import { Request } from 'express';

@Controller('auth/tfa')
@ApiBearerAuth()
export class AuthanticatorController {
	constructor(private authanticatorService: AuthanticatorService, private userService: UserService) { }

	@Get('QR')
	@UseGuards(JwtGuard)
	async getQR(@Req() req, @Res() res) {
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		const qrCode = await this.authanticatorService.getQR(user);
		const qrCodeBuffer = await qrcode.toBuffer(qrCode);
		res.set('Content-type', 'image/png');
		res.send(qrCodeBuffer);
	}

	@Get('enable')
	@UseGuards(JwtGuard)
	async enableTwoFactor(@Req() req, @Res() res){
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		const tfa = await this.authanticatorService.generateTwoFactorAuthenticationSecret(user);
		const qrCodeBuffer = await qrcode.toBuffer(tfa.qrCode);
		res.set('Content-type', 'image/png');
		res.send(qrCodeBuffer);
	}
	
	@Get('disable')
	@UseGuards(JwtGuard)
	async disableTwoFactor(@Req() req, @Res() res) {
		const userID: number = parseInt(req.body.toString(), 10);
		const user = await this.userService.getUserByID(userID, true);
		await this.authanticatorService.disableTwoFactorAuthentication(user);
	}

	// jwt_token
	@Get('verify/:token/:id')
	async verifyToken(@Req() req: Request,@Param('token') token: string, @Param('id') id: string): Promise<string> {
		const user_id: number = parseInt(id);
		const user = await this.userService.getUserByID(user_id, true);
		if (!user.TFAuth)
			throw new UnauthorizedException();
		const result = this.authanticatorService.verifyTwoFactorAuthentication(token, user.TFSecret);
		if (result)
			return await this.authanticatorService.Login(user_id);
		throw new UnauthorizedException();
	}
}

