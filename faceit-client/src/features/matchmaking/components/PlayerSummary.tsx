'use client';

import { skipToken } from '@reduxjs/toolkit/query';

import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { useGetMyRankQuery } from '@/store/api/leaderboardApi';
import { useGetPlayerStatisticsQuery } from '@/store/api/playerApi';
import { useGetMeQuery } from '@/store/api/userApi';

export function PlayerSummary() {
	const { data: me } = useGetMeQuery();
	const { data: rank } = useGetMyRankQuery();
	const { data: stats } = useGetPlayerStatisticsQuery(
		me?.nickname ?? skipToken
	);

	if (!me) {
		return null;
	}

	const items = [
		{ label: 'ELO', value: me.elo, accent: true },
		{ label: 'Rank', value: rank ? `#${rank.rank}` : '-' },
		{ label: 'Matches', value: stats?.matches ?? 0 },
		{ label: 'Wins', value: stats?.wins ?? 0 },
		{ label: 'Losses', value: stats?.losses ?? 0 },
		{ label: 'Win rate', value: `${Math.round(stats?.winRate ?? 0)}%` },
		{ label: 'K/D', value: (stats?.kd ?? 0).toFixed(2) }
	];

	return (
		<section className="flex flex-wrap items-center gap-x-10 gap-y-4 rounded-2xl bg-primary p-5">
			<div className="flex min-w-0 items-center gap-4">
				<PlayerAvatar
					nickname={me.nickname}
					profilePic={me.profilePic}
					className="h-16 w-16 text-xl"
				/>
				<h1 className="truncate text-2xl font-bold">{me.nickname}</h1>
			</div>
			<dl className="flex flex-1 flex-wrap justify-end gap-x-8 gap-y-3">
				{items.map((item) => (
					<div key={item.label} className="text-right">
						<dt className="text-xs uppercase tracking-wide text-neutral-400">
							{item.label}
						</dt>
						<dd
							className={`text-xl font-semibold ${item.accent ? 'text-widget' : ''}`}
						>
							{item.value}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
