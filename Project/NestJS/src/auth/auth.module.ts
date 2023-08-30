import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FortyTwoStrategy } from './strategies/fortytwo/fortytwo.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: '42'})
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy]
})
export class AuthModule {}
