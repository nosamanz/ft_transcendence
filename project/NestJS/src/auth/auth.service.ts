import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import axios from 'axios';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
		) {}

	async signin_intra(code: string): Promise<any> {
		const form = new FormData();
		form.append('grant_type', 'authorization_code');
		form.append('client_id', process.env.UID);
		form.append('client_secret', process.env.SECRET);
		form.append('code', code);
		form.append('redirect_uri', process.env.REDIRECT_URI);
		console.log("Geldi---->");
		const responseToken = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				body: form
			});
		console.log(responseToken);
		const dataToken = await responseToken.json();
		console.log("->>",dataToken.access_token);
		const responseInfo = await fetch('https://api.intra.42.fr/v2/me', {
			headers: {
				'Authorization': 'Bearer ' + dataToken.access_token
			}
		});
		console.log(responseInfo.ok);
		const dataInfo = await responseInfo.json();

		console.log("Hoşgeldin " + dataInfo.login);
		const user = await this.userService.getUserByLogin(dataInfo.login);
		if(user)
		{
			if(user.TFAuth === true)
			{
				return (2);
			}
			return (1);
		}
		await this.prisma.user.create({
			data: {

				id:			dataInfo.id,
				login:		dataInfo.login,
				email:		dataInfo.email,
				name:		dataInfo.first_name,
				surname:	dataInfo.last_name,
				imgLink:	dataInfo.image.link,
				TFSecret:	"Musab",
				TFAuth:		false,
				secretAscii:"Musablars"
			}
		});
		return (0);

	}
	// async getImageBuffer(url :string): Promise<Buffer> {
	// 	const response = await axios.get(url, { responseType: 'arraybuffer' });
	// 	return Buffer.from(response.data, 'base64');
	// }
	// async getLogin(code: string): Promise<string> {
	// 	return "Geldi";
	// }
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
