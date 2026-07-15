export type PlayerStatKey =
	| 'matches'
	| 'wins'
	| 'losses'
	| 'winRate'
	| 'avg'
	| 'kd'
	| 'kills'
	| 'deaths'
	| 'assists';

export interface IPlayerStats {
	id: string;
	userId: string;
	totalMatches: number;
	totalWins: number;
	totalLosses: number;
	totalKills: number;
	totalDeaths: number;
	totalAssists: number;
	totalHeadshots: number;
	totalMvpRounds: number;
	updatedAt: string;
}
