import { Module } from '@nestjs/common';
import { TFAController } from './tfa.controller';
import { TFAService } from './tfa.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../jwtconstants';
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserService } from 'src/user/user.service';

@Module({
	imports:[
		PrismaModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '3000s' },
		}),],
	controllers: [TFAController],
	providers: [TFAService, UserService, JwtService],
	exports:[TFAService]
})
export class TFAModule {}
