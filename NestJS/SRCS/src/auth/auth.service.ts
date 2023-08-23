import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signin_intra(): Promise<any> {
    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('client_id', 'u-s4t2ud-bbfbe7593d2e8d5c3878b3c32d6095c72d7e249eb711983ec73694f0f6962561');
    form.append('client_secret', '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');
    form.append('code', 'Geldim');
    form.append('redirect_uri', 'http://localhost:5000/chat');

    const responseToken = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        body: form
    });
    const dataToken = await responseToken.json();

    const responseInfo = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
            'Authorization': 'Bearer ' + dataToken.access_token
        }
    });
    const dataInfo = await responseInfo.json();

    console.log(dataInfo.email + "Ha bu geldi");
    // // dataInfo içinden istenilen datalar çekilebilir
    // var dto: AuthDto = {
    //     email: dataInfo.email,
    //     hash: process.env.BACKEND_GENERAL_SECRET_KEY as string,
    //     firstName: dataInfo.first_name,
    //     lastName: dataInfo.last_name,
    //     userName: dataInfo.login
    // }

    // var firstSingIn = false;
    // var user: string | any = await this.prisma.user.findUnique({
    //     where: {
    //         email: dto.email,
    //     },
    // });
    // if (!user) {
    //     await this.signup(dto);

    //     user = await this.prisma.user.findUnique({
    //         where: {
    //             email: dto.email,
    //         },
    //     });
    //     firstSingIn = true;
    // }
  }
}
