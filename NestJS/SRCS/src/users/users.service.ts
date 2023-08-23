import { Injectable } from '@nestjs/common';
import {User} from '../entities/user.entity'

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
	findAll() {
		// return this.users;
	}

	findById(userId: number) {
		// return this.users.find(user => user.id === userId);
		return new User();
	}
  async createUser(nick: string, pass: string): Promise<User> {
    const user = new User();
    user.nick = nick;
    user.pass = pass;
    return await this.userRepository.save(user);
  }
}
