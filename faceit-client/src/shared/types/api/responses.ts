import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IMatch, TMatchType } from '../match';
import { IPlayerStats } from '../stats';

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

export interface AcceptanceData {
	acceptance: {
		acceptanceId: string;
		expiresAt: string;
		acceptedPlayers: number;
		totalPlayers: number;
		hasAccepted: boolean;
	};
}

export interface IAcceptanceRes extends AcceptanceData {
	hasAcceptance: boolean;
}

export type TApiError = FetchBaseQueryError & {
	data: {
		statusCode: number;
		message: string;
		error: string;
	};
};
