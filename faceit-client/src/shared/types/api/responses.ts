import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface IAccount {
	id: string;
	type: string;
	provider: string;
	refreshToken: string;
	accessToken: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
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
	elo: number;
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

export interface IPlayerProfile {
	nickname: string;
	profilePic: string;
	createdAt: string;
}

export type TApiError = FetchBaseQueryError & {
	data: {
		statusCode: number;
		message: string;
		error: string;
	};
};
