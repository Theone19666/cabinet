export interface IContacts {
	id: number;
	name: string;
	surname: string;
	patronymic: string;
	phone: string;
}

export interface IStore {
	contacts: IContacts[];
}

export interface IAuth {
	id: number;
	login: string;
	password: string;
}

export interface IObject {
	[key: string]: any;
}
