import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    async createUser(nick: string, pass: string): Promise<void> {

    }
    getHello(msq: string): string
    {
        return("Your(msq): " + msq);
    }
}
