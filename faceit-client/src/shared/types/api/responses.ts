export interface IAccount {
	id: string;
	type: string;
	provider: string;
	refreshToken: string;
	accessToken: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	user: IUser;
	userId: string;
}

export interface IUser {
	user: IUserData;
}

export interface IUserData {
	id: string;
	email: string;
	password: string;
	nickname: string;
	profilePic: string;
	role: string;
	isVerified: boolean;
	isTwoFactorEnabled: boolean;
	method: string;
	createdAt: string;
	updatedAt: string;
	accounts: any[];
}

export interface IInfoMessageRes {
	message: string;
}

export interface IErrorRes {
	message: string;
	error: string;
	statusCode: number;
}
