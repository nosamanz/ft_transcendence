import { Controller, Get, Param, Post , Body, Res} from '@nestjs/common';
import axios from 'axios';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as path from 'path'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService){}

	// @Get()
	// async getAuth() {
	// try {
	// 	const response = await axios.get(
	// 	'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-bbfbe7593d2e8d5c3878b3c32d6095c72d7e249eb711983ec73694f0f6962561&redirect_uri=http%3A%2F%2F10.12.14.1%3A5000%2F&response_type=code'
	// 	);

	// 	const responseData = response.data;
	// 	// Handle and process responseData as needed
	// 	console.log(responseData);

	// 	return responseData; // Dönülen veri
	// } catch (error) {
	// 	console.error('Error making HTTP request:', error);
	// 	// Handle error and return an appropriate response
	// }
	// }

	@Get()
	getUsers(@Res() response : Response){
		const filePath = path.join(__dirname, '..', '..' ,'..', 'Front', 'html', 'auth.html');
		return response.sendFile(filePath);
	}

	@Post()
    signin_intra() {
        this.authService.signin_intra();
    }
}
