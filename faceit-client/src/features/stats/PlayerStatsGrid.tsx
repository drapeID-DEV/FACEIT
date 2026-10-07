import { PlayerStat } from '@/shared/components/ui/PlayerStat';
import { IPlayerStatistics, PlayerStatKey } from '@/shared/types/stats';

interface StatItem {
	title: string;
	value: number;
	decimals?: number;
}

interface Props {
	playerStats: IPlayerStatistics;
	items: PlayerStatKey[];
	variant?: 'default' | 'card';
}

export function PlayerStatsGrid({
	playerStats,
	items,
	variant = 'default'
}: Props) {
	const stats: Record<PlayerStatKey, StatItem> = {
		matches: {
			title: 'Matches',
			value: playerStats.matches
		},
		wins: {
			title: 'Wins',
			value: playerStats.wins
		},
		losses: {
			title: 'Losses',
			value: playerStats.losses
		},
		winRate: {
			title: 'Win %',
			value: playerStats.winRate
		},
		avg: {
			title: 'AVG',
			value: playerStats.averageKills
		},
		kd: {
			title: 'K/D',
			value: playerStats.kd,
			decimals: 2
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
					decimals={stats[item].decimals}
					variant={variant}
				/>
			))}
		</>
	);
}
