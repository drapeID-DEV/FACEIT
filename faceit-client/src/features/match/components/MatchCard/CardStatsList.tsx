import { MatchCardStat } from '@/shared/components/ui/MatchCardStat';
import { IPlayerStats } from '@/shared/types/user';

interface Props {
	playerStats: IPlayerStats;
}

export function CardStatsList({ playerStats }: Props) {
	const avg =
		playerStats.totalMatches > 0
			? Math.floor(playerStats.totalKills / playerStats.totalMatches)
			: 0;

	const kd =
		playerStats.totalDeaths > 0
			? +(playerStats.totalKills / playerStats.totalDeaths).toFixed(2)
			: playerStats.totalKills;

	const winRate =
		playerStats.totalMatches > 0
			? Math.round(
					(playerStats.totalWins / playerStats.totalMatches) * 100
				)
			: 0;

	return (
		<>
			<MatchCardStat title="Matches" value={playerStats.totalMatches} />
			<MatchCardStat title="Wins %" value={winRate} />
			<MatchCardStat title="AVG" value={avg} />
			<MatchCardStat title="K/D" value={kd} />
		</>
	);
}
