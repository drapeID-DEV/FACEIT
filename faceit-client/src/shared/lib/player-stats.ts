import { IPlayerStats } from '../types/stats';

export function getPlayerStats(stats: IPlayerStats) {
	const avg =
		stats.totalMatches > 0
			? Math.floor(stats.totalKills / stats.totalMatches)
			: 0;

	const kd =
		stats.totalDeaths > 0
			? +(stats.totalKills / stats.totalDeaths).toFixed(2)
			: stats.totalKills;

	const winRate =
		stats.totalMatches > 0
			? Math.round((stats.totalWins / stats.totalMatches) * 100)
			: 0;

	return {
		avg,
		kd,
		winRate
	};
}
