import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {User} from '../entities/user.entity'

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// @Injectable()
// export class UsersService {
// 	private users: User[] = [{id: 0, name:'nosamanz'}];


// 	findAll() {
// 		return this.users;
// 	}

// 	findById(userId: number) {
// 		return this.users.find(user => user.id === userId);
// 	}
// 	createUser(createUserDto: CreateUserDto) {

// 		const newUser = {id: Date.now(), ...createUserDto};//...(name,age...)

// 		this.users.push(newUser);

// 		return newUser;
// 	}
// }

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
  async createUser(name: string, email: string): Promise<User> {
    const user = new User();
    user.name = name;
    user.email = email;
    return await this.userRepository.save(user);
  }
}
