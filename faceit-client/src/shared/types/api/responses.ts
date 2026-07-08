import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IMatch, TMatchType } from '../match';

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

export interface ICurrentMatchResponse {
	hasActiveMatch: boolean;
	match: IMatch | null;
}

export interface IQueueStatusResponse {
	inQueue: boolean;
	queuePosition: number;
	queueSize: number;
	matchType: TMatchType;
	joinedAt: string;
}

export type TApiError = FetchBaseQueryError & {
	data: {
		statusCode: number;
		message: string;
		error: string;
	};
};
