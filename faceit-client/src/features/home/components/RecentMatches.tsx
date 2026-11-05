'use client';

import Link from 'next/link';
import { skipToken } from '@reduxjs/toolkit/query';

import { Loader } from '@/shared/components/ui/Loader';
import { MatchResultBadge } from '@/shared/components/ui/MatchResultBadge';
import { getEnemyTeamName } from '@/shared/lib/enemy-teamname';
import { useGetMatchesHistoryQuery } from '@/store/api/playerApi';
import { useGetMeQuery } from '@/store/api/userApi';

import { HomeSection } from './HomeSection';

export function RecentMatches() {
	const { data: me } = useGetMeQuery();
	const { data, isLoading, isError } = useGetMatchesHistoryQuery(
		me?.nickname ?? skipToken
	);

	// isWinner only means something once a match has finished
	const matches = data
		?.filter((item) => item.match.status === 'FINISHED')
		.slice(0, 5);

	return (
		<HomeSection
			title="Recent matches"
			href={me ? `/players/${me.nickname}/matches` : undefined}
		>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<p className="text-sm text-neutral-400">
					Unable to load your matches
				</p>
			) : !matches?.length ? (
				<p className="rounded-xl bg-primary p-4 text-sm text-neutral-400">
					No finished matches yet. Your results will show up here.
				</p>
			) : (
				<ul className="flex flex-col gap-2">
					{matches.map((item) => {
						const { team1Score, team2Score, selectedMap } =
							item.match;
						const [myScore, enemyScore] =
							item.team === 1
								? [team1Score, team2Score]
								: [team2Score, team1Score];

						return (
							<li key={item.id}>
								<Link
									href={`/match/${item.matchId}`}
									className="flex items-center gap-3 rounded-xl bg-accent p-3 duration-200 hover:bg-neutral-700"
								>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">
											{getEnemyTeamName(item)}
										</p>
										<p className="truncate text-xs text-neutral-400">
											{selectedMap}
										</p>
									</div>
									<span className="font-mono text-sm">
										{myScore} : {enemyScore}
									</span>
									<MatchResultBadge
										isWinner={item.isWinner}
									/>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</HomeSection>
	);
}
