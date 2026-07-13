import { IPlayerStats } from './user';

export type TMatchStatus =
	| 'SEARCHING'
	| 'READY'
	| 'LIVE'
	| 'FINISHED'
	| 'CANCELLED';

export type TMatchType = 'ONE_VS_ONE' | 'TEAM';

export interface IMatchParticipant {
	id: string;
	userId: string;
	matchId: string;
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
	user: {
		id: string;
		nickname: string;
		profilePic: string;
		elo: number;
		playerStats: IPlayerStats;
	};
}

export interface IMatch {
	id: string;

	matchType: TMatchType;
	maxPlayersPerTeam: number;

	status: TMatchStatus;

	winnerTeam: number | null;

	team1Score: number;
	team2Score: number;

	cancelledBy: string | null;
	cancellationReason: string | null;

	createdAt: string;
	updatedAt: string;
	finishedAt: string | null;

	participants: IMatchParticipant[];
}
