import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async signin_intra(code: string): Promise<any> {
		const form = new FormData();
		form.append('grant_type', 'authorization_code');
		form.append('client_id', 'u-s4t2ud-e7bed2aab0541a9726ad7abcc0023e254fe1c3b64bfab299d2d2a395b625a545');
		form.append('client_secret', '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');
		form.append('code', code);
		form.append('redirect_uri', 'http://10.12.14.1:80/auth/getcode');

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
		console.log(dataInfo.id);

		const userData = {
			id:				dataInfo.id,
			email:		dataInfo.email,
			name:			dataInfo.first_name,
			surname:	dataInfo.last_name,
			login:		dataInfo.login,
			imgLink:	dataInfo.image.link,
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


// Will respond with the current resource owner, wich is the token owner (the actually logged-in user).

// live_help Notes
// assignment_ind This action requires a token resource owner .
// Raw
// Curl
// Ruby
// JavaScript
// GET /v2/me
// 200
// {
//   "id": 2,
//   "email": "andre@42.fr",
//   "login": "andre",
//   "first_name": "André",
//   "last_name": "Aubin",
//   "usual_full_name": "Juliette Aubin",
//   "usual_first_name": "Juliette",
//   "url": "https://api.intra.42.fr/v2/users/andre",
//   "phone": null,
//   "displayname": "André Aubin",
//   "kind": "admin",
//   "image": {
//     "link": "https://cdn.intra.42.fr/users/1234567890/andre.jpg",
//     "versions": {
//       "large": "https://cdn.intra.42.fr/users/1234567890/large_andre.jpg",
//       "medium": "https://cdn.intra.42.fr/users/1234567890/medium_andre.jpg",
//       "small": "https://cdn.intra.42.fr/users/1234567890/small_andre.jpg",
//       "micro": "https://cdn.intra.42.fr/users/1234567890/micro_andre.jpgg"
//     }
//   },
//   "staff?": false,
//   "correction_point": 4,
//   "pool_month": "july",
//   "pool_year": "2016",
//   "location": null,
//   "wallet": 0,
//   "anonymize_date": "2021-02-20T00:00:00.000+03:00",
//   "data_erasure_date": null,
//   "alumni?": false,
//   "active?": true,
//   "groups": [],
//   "cursus_users": [
//     {
//       "id": 2,
//       "begin_at": "2017-05-14T21:37:50.172Z",
//       "end_at": null,
//       "grade": null,
//       "level": 0.0,
//       "skills": [],
//       "cursus_id": 1,
//       "has_coalition": true,
//       "user": {
//         "id": 2,
//         "login": "andre",
//         "url": "https://api.intra.42.fr/v2/users/andre"
//       },
//       "cursus": {
//         "id": 1,
//         "created_at": "2017-11-22T13:41:00.750Z",
//         "name": "Piscine C",
//         "slug": "piscine-c"
//       }
//     }
//   ],
//   "projects_users": [],
//   "languages_users": [
//     {
//       "id": 2,
//       "language_id": 3,
//       "user_id": 2,
//       "position": 1,
//       "created_at": "2017-11-22T13:41:03.638Z"
//     }
//   ],
//   "achievements": [],
//   "titles": [],
//   "titles_users": [],
//   "partnerships": [],
//   "patroned": [
//     {
//       "id": 4,
//       "user_id": 2,
//       "godfather_id": 15,
//       "ongoing": true,
//       "created_at": "2017-11-22T13:42:11.565Z",
//       "updated_at": "2017-11-22T13:42:11.572Z"
//     }
//   ],
//   "patroning": [],
//   "expertises_users": [
//     {
//       "id": 2,
//       "expertise_id": 3,
//       "interested": false,
//       "value": 2,
//       "contact_me": false,
//       "created_at": "2017-11-22T13:41:22.504Z",
//       "user_id": 2
//     }
//   ],
//   "roles": [],
//   "campus": [
//     {
//       "id": 1,
//       "name": "Cluj",
//       "time_zone": "Europe/Bucharest",
//       "language": {
//         "id": 3,
//         "name": "Romanian",
//         "identifier": "ro",
//         "created_at": "2017-11-22T13:40:59.468Z",
//         "updated_at": "2017-11-22T13:41:26.139Z"
//       },
//       "users_count": 28,
//       "vogsphere_id": 1
//     }
//   ],
//   "campus_users": [
//     {
//       "id": 2,
//       "user_id": 2,
//       "campus_id": 1,
//       "is_primary": true
//     }
//   ]
// }
