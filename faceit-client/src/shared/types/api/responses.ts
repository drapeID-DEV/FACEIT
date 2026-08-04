import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IMatch, TMatchStatus, TMatchType } from '../match';
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

export interface IEloHistoryItem {
	matchId: string;
	team: number;
	isWinner: boolean;
	eloBefore: number;
	eloAfter: number;
	kills: number;
	deaths: number;
	assists: number;
	createdAt: string;
	match: Pick<
		IMatch,
		| 'id'
		| 'matchType'
		| 'status'
		| 'team1Score'
		| 'team2Score'
		| 'finishedAt'
	>;
}

export interface IMapBanState {
	status: 'MAP_BAN' | 'LIVE';
	availableMaps: string[];
	selectedMap: string | null;
	currentBanTurn: 'TEAM1' | 'TEAM2';
	team1LeaderId: string | null;
	team2LeaderId: string | null;
	banDeadline: string | null;
	isMyTurn: boolean;
}

export type TApiError = FetchBaseQueryError & {
	data: {
		statusCode: number;
		message: string;
		error: string;
	};
};
