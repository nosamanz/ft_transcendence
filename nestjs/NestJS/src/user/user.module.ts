import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/jwtconstants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3000s' },
    }),
  ],
  providers: [UserService, PrismaService, JwtService],
  controllers: [UserController]
})
export class UserModule {}
