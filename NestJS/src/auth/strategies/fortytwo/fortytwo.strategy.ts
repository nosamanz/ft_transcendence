import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.UID,
      clientSecret: process.env.SECRET,
      callbackURL: process.env.REDIRECT_URI, // Replace with your callback URL
    });
  }
}
