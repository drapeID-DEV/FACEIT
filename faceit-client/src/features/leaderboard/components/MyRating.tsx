'use client';

import { useGetMyRankQuery } from '@/store/api/leaderboardApi';

export function MyRating() {
	const { data, isLoading } = useGetMyRankQuery();

	if (isLoading) {
		return null;
	}

	if (!data) {
		return null;
	}

	return (
		<div className="flex items-center gap-6">
			<div>
				<p className="text-sm text-neutral-400">Your rating</p>
				<p className="text-xl font-semibold">{data.elo}</p>
			</div>
			<div>
				<p className="text-sm text-neutral-400">Rank</p>
				<p className="text-xl font-semibold">#{data.rank}</p>
			</div>
		</div>
	);
}
