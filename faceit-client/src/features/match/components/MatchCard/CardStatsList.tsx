import { PlayerStat } from '@/shared/components/ui/PlayerStat';
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
			<PlayerStat title="Matches" value={playerStats.totalMatches} />
			<PlayerStat title="Wins %" value={winRate} />
			<PlayerStat title="AVG" value={avg} />
			<PlayerStat title="K/D" value={kd} />
		</>
	);
}
