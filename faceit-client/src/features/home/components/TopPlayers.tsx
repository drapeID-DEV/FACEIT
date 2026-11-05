'use client';

import { Loader } from '@/shared/components/ui/Loader';
import { useGetLeaderboardQuery } from '@/store/api/leaderboardApi';

import { HomeSection } from './HomeSection';
import { PlayerRow } from './PlayerRow';

export function TopPlayers() {
	const { data, isLoading, isError } = useGetLeaderboardQuery({
		page: 1,
		limit: 5
	});

	return (
		<HomeSection title="Top players" href="/rank">
			{isLoading ? (
				<Loader />
			) : isError || !data ? (
				<p className="text-sm text-neutral-400">
					Unable to load the leaderboard
				</p>
			) : (
				<ul className="flex flex-col gap-2">
					{data.players.map((player) => (
						<li key={player.id}>
							<PlayerRow player={player} rank={player.rank} />
						</li>
					))}
				</ul>
			)}
		</HomeSection>
	);
}
