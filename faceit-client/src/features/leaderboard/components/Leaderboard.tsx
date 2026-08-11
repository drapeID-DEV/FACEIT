'use client';

import { MyRating } from './MyRating';
import { LeaderboardRow } from './LeaderboardRow';
import { useGetLeaderboardQuery } from '@/store/api/leaderboardApi';
import { Loader } from '@/shared/components/ui/Loader';

export function Leaderboard() {
	const { data, isLoading, isError } = useGetLeaderboardQuery({
		page: 1,
		limit: 20
	});

	if (isLoading) {
		return <Loader />;
	}

	if (isError || !data) {
		return <div>Failed to load leaderboard</div>;
	}

	return (
		<div className="flex min-w-0 flex-col gap-8">
			<h1 className="text-4xl font-semibold">Leaderboard</h1>
			<MyRating />
			<div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
				<div className="grid grid-cols-[80px_1fr_120px] border-b border-neutral-800 bg-neutral-900 px-6 py-4 text-sm font-bold text-widget">
					<span>Rank</span>
					<span>Player</span>
					<span className="text-right">ELO</span>
				</div>
				{data.players.map((player) => (
					<LeaderboardRow key={player.id} player={player} />
				))}
			</div>
		</div>
	);
}
