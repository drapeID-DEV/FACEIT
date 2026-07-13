import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IMatch, TMatchType } from '../match';
import { IPlayerStats } from '../user';

export interface IInfoMessageRes {
	message: string;
}

export interface IPlayerProfileRes {
	id: string;
	nickname: string;
	profilePic: string;
	elo: number;
	createdAt: string;
	updatedAt: string;
	playerStats: IPlayerStats;
}

export interface ICurrentMatchRes {
	hasActiveMatch: boolean;
	match: IMatch | null;
}

export interface IQueueStatusRes {
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
