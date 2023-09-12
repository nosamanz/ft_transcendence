export class CreateUserDto {
    id: number;
	email: string;
	name: string;
	surname: string;
	login: string;
	imgLink: string;
	state: string;
	TFAuth: boolean;
	TFSecret: string;
	secretAscii: string;
}

export class UpdateUserDto {
    id?: number;
    email?: string;
    name?: string;
    surname?: string;
    login?: string;
    imgLink?: string;
    state?: string;
    TFAuth?: boolean;
    TFSecret?: string;
    secretAscii?: string;
}