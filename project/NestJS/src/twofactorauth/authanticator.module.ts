import { Module } from '@nestjs/common';
import { AuthanticatorController } from './authanticator.controller';
import { AuthanticatorService } from './authanticator.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../jwtconstants';
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserService } from 'src/user/user.service';

@Module({
	imports:[PrismaModule, JwtModule.register({secret: jwtConstants.secret})],
	controllers: [AuthanticatorController],
	providers: [AuthanticatorService, UserService, JwtService],
	exports:[AuthanticatorService]
})
export class AuthanticatorModule {}
