import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../jwtconstants';


@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: '42'}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3000s' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, UserService]
})
export class AuthModule {}
