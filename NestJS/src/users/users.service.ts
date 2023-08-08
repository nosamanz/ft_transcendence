import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {User} from './entitiest/user.entity'

@Injectable()
export class UsersService {
	private users: User[] = [{id: 0, name:'nosamanz'}];

	findAll() {
		return this.users;
	}

	findById(userId: number) {
		return this.users.find(user => user.id === userId);
	}

	createUser(createUserDto: CreateUserDto) {

		const newUser = {id: Date.now(), ...createUserDto};//...(name,age...)

		this.users.push(newUser);

		return newUser;
	}
}
