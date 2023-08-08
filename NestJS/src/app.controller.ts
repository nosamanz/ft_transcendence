import { Body, Controller, Get, Post, Res, Req} from '@nestjs/common';
import { Response, response } from 'express';
import { AppService } from './app.service';
import * as path from 'path';
import { send } from 'process';

@Controller('trans')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  getHtml(@Res() response: Response) {
    const filePath = path.join(__dirname, '..', '..', 'index', 'index.html');
    return response.sendFile(filePath);
    // return response.sendFile('../../index/index.html');
  }
  @Post('login')
  getResponse(@Req() request: Request, @Body() body : any) {
    console.log('body-> ', body);
  }
  @Get('hello')
  callGetHello(@Res() response: Response) {
    const message = this.appService.getHello();
    response.send(message);
  }
}
