import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin_intra(code: string): Promise<any> {
    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('client_id', 'u-s4t2ud-3acdd82321754495e923a9bae02a845d8a57cfc750d5c632014ee58a2d78fa53');
    form.append('client_secret', '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');
    form.append('code', code);
    form.append('redirect_uri', 'http://localhost:5000/auth/getcode');

    const responseToken = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        body: form
      });
      console.log(responseToken.ok);
    const dataToken = await responseToken.json();

    const responseInfo = await fetch('https://api.intra.42.fr/v2/me', {
      headers: {
        'Authorization': 'Bearer ' + dataToken.access_token
      }
    });
    console.log(responseInfo.ok);
    const dataInfo = await responseInfo.json();
    const responseLast = await fetch('https://api.intra.42.fr/oauth/token/info', {
      headers: {
        'Authorization': 'Bearer ' + dataToken.access_token
      }
    });
    const dataInfo1 = await responseLast.json();
    console.log("The Info is:" + dataInfo1);

    console.log(dataInfo.email);
    console.log(dataInfo.last_name);
    console.log(dataInfo.first_name);
    console.log(typeof(dataInfo));

    const userData = {
      email: dataInfo.email,
      name: dataInfo.first_name,
      surname: dataInfo.last_name,
    };

    const createdUser = await this.prisma.user.create({
      data: userData,
    });

    console.log('Created user:', createdUser);

    // const email = dataInfo.email;
    // const firstName = dataInfo.first_name;
    // const lastName = dataInfo.last_name;

    // this.prisma.user.create(
    //   {
    //     data: {
    //       email: dataInfo.email,
    //       name: dataInfo.name,
    //       surname: dataInfo.surname,
    //     },
    //   }
    // )

    // const createdUser = await this.prisma.user.create(
    //   {
    //     data: {
    //       email: dataInfo.email,
    //       name: dataInfo.name,
    //       surname: dataInfo.surname,
    //     },
    //   }
    // );

    // console.log('Created user:', createdUser);
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
