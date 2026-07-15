import { PlayerStat } from '@/shared/components/ui/PlayerStat';
import { getPlayerStats } from '@/shared/lib/player-stats';
import { IPlayerStats, PlayerStatKey } from '@/shared/types/stats';

interface Props {
	playerStats: IPlayerStats;
	items: PlayerStatKey[];
	variant?: 'default' | 'card';
}

export function PlayerStatsGrid({
	playerStats,
	items,
	variant = 'default'
}: Props) {
	const { avg, kd, winRate } = getPlayerStats(playerStats);

	const stats = {
		matches: {
			title: 'Matches',
			value: playerStats.totalMatches
		},
		wins: {
			title: 'Wins',
			value: playerStats.totalWins
		},
		losses: {
			title: 'Losses',
			value: playerStats.totalLosses
		},
		winRate: {
			title: 'Win %',
			value: winRate
		},
		avg: {
			title: 'AVG',
			value: avg
		},
		kd: {
			title: 'K/D',
			value: kd
		},
		kills: {
			title: 'Kills',
			value: playerStats.totalKills
		},
		deaths: {
			title: 'Deaths',
			value: playerStats.totalDeaths
		},
		assists: {
			title: 'Assists',
			value: playerStats.totalAssists
		}
	};

	return (
		<>
			{items.map((item) => (
				<PlayerStat
					key={item}
					title={stats[item].title}
					value={stats[item].value}
					variant={variant}
				/>
			))}
		</>
	);
}
