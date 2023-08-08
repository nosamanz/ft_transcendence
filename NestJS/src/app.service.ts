import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // console.log('i am in injectable getHello method');
    return 'Hello World!' ;
  }
}
