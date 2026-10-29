import { IPlayerStatistics } from './stats';

export type TMatchStatus =
	| 'SEARCHING'
	| 'READY'
	| 'MAP_BAN'
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
		playerStats: IPlayerStatistics;
	};
}

export interface IMatch {
	id: string;
	matchType: TMatchType;
	maxPlayersPerTeam: number;
	status: TMatchStatus;
	selectedMap: string | null;
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

export type TSide = 'CT' | 'TERRORIST';

// Pushed by the server over `liveStats` while the CS2 match is running
export interface ILiveMatchStats {
	matchId: string;
	isLive: boolean;
	round: number;
	team1Score: number;
	team2Score: number;
	players: {
		userId: string;
		team: number;
		side: TSide | null;
		kills: number;
		deaths: number;
		assists: number;
		headshots: number;
	}[];
}
