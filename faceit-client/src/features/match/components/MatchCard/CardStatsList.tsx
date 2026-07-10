import { MatchCardStat } from '@/shared/components/ui/MatchCardStat';
import { useGetPlayerStatsQuery } from '@/store/api/statsApi';

interface Props {
	playerId: string;
}

export function CardStatsList({ playerId }: Props) {
	const { data, isLoading, isError } = useGetPlayerStatsQuery(playerId);

	if (isError) {
		return <>Unable to load stats</>;
	}

	if (isLoading) {
		return <>Loading...</>;
	}

	if (!data) {
		return <>Unable to load stats</>;
	}

	const avg =
		data.totalMatches > 0
			? Math.floor(data.totalKills / data.totalMatches)
			: 0;

	const kd =
		data.totalDeaths > 0
			? +(data.totalKills / data.totalDeaths).toFixed(2)
			: data.totalKills;

	const winRate =
		data.totalMatches > 0
			? Math.round((data.totalWins / data.totalMatches) * 100)
			: 0;

	return (
		<>
			<MatchCardStat title="Wins %" value={winRate} />
			<MatchCardStat title="AVG" value={avg} />
			<MatchCardStat title="K/D" value={kd} />
		</>
	);
}
