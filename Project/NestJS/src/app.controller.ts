import { Body, Controller, Get, Post, Res, Req} from '@nestjs/common';
import { Response, response } from 'express';
import { AppService } from './app.service';
import * as path from 'path';
import { send } from 'process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log("Hello World");
  }
  // @Post()
  // getResponse(@Req() request: Request, @Body() body : any) {
  //   console.log('body-> ', body);
  // }
}
