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

export interface IShortStats {
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

export interface IPlayerStatistics {
	elo: number;
	matches: number;
	wins: number;
	losses: number;
	winRate: number;
	kd: number;
	headshotRate: number;
	averageKills: number;
	averageDeaths: number;
	averageAssists: number;
	totalKills: number;
	totalDeaths: number;
	totalAssists: number;
	totalHeadshots: number;
	totalMvpRounds: number;
	sampleSizeCategory: 'none' | 'very_small' | 'small' | 'medium' | 'large';
	hasEnoughData: boolean;
}

export type AiRecommendationPriority = 'high' | 'medium' | 'low';

export interface IAiRecommendation {
	title: string;
	description: string;
	priority: AiRecommendationPriority;
}

export interface IAiRecommendationsResponse {
	recommendations: IAiRecommendation[];
}
