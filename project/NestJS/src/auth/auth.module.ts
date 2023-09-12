import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FortyTwoStrategy } from './strategies/fortytwo/fortytwo.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: '42'}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, UserService]
})
export class AuthModule {}
