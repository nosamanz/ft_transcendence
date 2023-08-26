import { Controller, Get, Res} from '@nestjs/common';
import { Response, response } from 'express';
import * as path from 'path'

@Controller()
export class AppController {

  @Get()
	getUsers(@Res() response : Response){
		const filePath = path.join(__dirname, '..' ,'..', 'Front', 'html', 'index.html');
		return response.sendFile(filePath);
	}
}
