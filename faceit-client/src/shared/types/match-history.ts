import { IMatch, TMatchStatus } from './match';

export interface IMatchHistory {
	id: string;
	matchType: IMatch;
	status: TMatchStatus;
	team1Score: number;
	team2Score: number;
	finishedAt: string | null;
	participants: IMatchHistoryParticipant[];
}

export interface IMatchHistoryParticipant {
	team: number;
	user: IMatchHistoryUser;
}

export interface IMatchHistoryUser {
	id: string;
	nickname: string;
	profilePic?: string | null;
	elo: number;
}

export interface IMatchHistoryItem {
	id: string;
	matchId: string;
	userId: string;
	team: number;
	isWinner: boolean;
	eloBefore: number;
	eloAfter: number;
	kills: number;
	deaths: number;
	assists: number;
	headshots: number;
	mvpRounds: number;
	createdAt: string;
	match: IMatchHistory;
}
