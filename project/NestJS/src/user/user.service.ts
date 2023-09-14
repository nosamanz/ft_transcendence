import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/DTO/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService
{
    constructor(private prisma: PrismaService){}

    async getUserByID(id: number): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                id: id
            },
        });
        return user;
    }
    async getUserByLogin(login: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                login: login
            },
        });
        return user;
    }
    async updateUser(userUpdate: UpdateUserDto, user: CreateUserDto) {
        await this.prisma.user.update({
            where: {
                login: user.login
            },
            data: userUpdate,
        });
    }
}
